var faker = require('faker');

describe('Inventory', function() {

  const repositoryName = faker.name.findName()
  const updatedRepositoryName = faker.name.findName()
  let repositoryColumnName = faker.name.findName()

  function getMessage(){
    cy.request({
      url: 'http://localhost:15672/api/queues/%2F/inventory_event_queue/get',
      method: 'POST',
      body: JSON.stringify({"count":5,"ackmode":"ack_requeue_false","encoding":"auto","truncate":50000}),
      auth: {
        user: 'guest',
        password: 'guest'
      },
      headers: {
        "Content-type": "application/json"
      }
    }).then((response) => {
      return response
      // cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_column_created")
      // cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(repositoryColumnName)
    })
  }

  before(function(){
    cy.clearCookies()
    cy.visit('/users/sign_in')
    cy.get('#user_email').type('admin@scinote.net')
    cy.get('#user_remember_me').check()
    cy.get('#user_password').type(`inHisHouseAtRlyehDeadCthulhuWaitsDreaming{enter}`)
    cy.visit('/repositories')
    cy.get('#create-new-repository').click()
    cy.get('#repository_name').type(`${repositoryName}{enter}`)
    getMessage()
  })

  beforeEach(function(){
    Cypress.Cookies.preserveOnce('_scinote_session', 'remember_user_token')
  })

  after(function(){

  })

  it('Sends webhook on create new inventory column', function() {
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.repository-cog > .dropdown-menu > :nth-child(2) > a').click()
    cy.wait(2000)
    cy.get('button[data-action=new-column-modal]').click()
    cy.get('#repository_column_name').type(`${repositoryColumnName}{enter}`)
    cy.get('.btn-success').click()
    cy.request({
      url: 'http://localhost:15672/api/queues/%2F/inventory_event_queue/get',
      method: 'POST',
      body: JSON.stringify({"count":5,"ackmode":"ack_requeue_false","encoding":"auto","truncate":50000}),
      auth: {
        user: 'guest',
        password: 'guest'
      },
      headers: {
        "Content-type": "application/json"
      }
    }).then((response) => {
      cy.log(JSON.parse(response.body[response.body.length-1].payload))
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_column_created")
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(repositoryColumnName)
    })
  })

  repositoryColumnName = faker.name.findName()

  it('Sends webhook on update inventory column', function() {
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.repository-cog > .dropdown-menu > :nth-child(2) > a').click()
    cy.wait(2000)
    cy.get('button[data-action=edit]').click()
    cy.wait(2000)
    cy.get('#repository_column_name').clear()
    cy.get('#repository_column_name').type(`${repositoryColumnName}{enter}`)
    cy.get('.btn-success').click()
    cy.request({
      url: 'http://localhost:15672/api/queues/%2F/inventory_event_queue/get',
      method: 'POST',
      body: JSON.stringify({"count":5,"ackmode":"ack_requeue_false","encoding":"auto","truncate":50000}),
      auth: {
        user: 'guest',
        password: 'guest'
      },
      headers: {
        "Content-type": "application/json"
      }
    }).then((response) => {
      cy.log(JSON.parse(response.body[response.body.length-1].payload))
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_column_updated")
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(repositoryColumnName)
    })
  })

  it('Sends webhook on destroy inventory column', function() {
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.repository-cog > .dropdown-menu > :nth-child(2) > a').click()
    cy.wait(2000)
    cy.get('.delete-column').click()
    cy.wait(2000)
    cy.get('button[data-action=delete]').click()
    cy.request({
      url: 'http://localhost:15672/api/queues/%2F/inventory_event_queue/get',
      method: 'POST',
      body: JSON.stringify({"count":5,"ackmode":"ack_requeue_false","encoding":"auto","truncate":50000}),
      auth: {
        user: 'guest',
        password: 'guest'
      },
      headers: {
        "Content-type": "application/json"
      }
    }).then((response) => {
      cy.log(JSON.parse(response.body[response.body.length-1].payload))
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(repositoryColumnName)
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_column_destroyed")
    })
  })


})
