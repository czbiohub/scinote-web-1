var faker = require('faker');

describe('Inventory', function() {

  const repositoryName = faker.name.findName()
  const updatedRepositoryName = faker.name.findName()

  beforeEach(function(){
    cy.visit('/users/sign_in')
    cy.get('#user_email').type('admin@scinote.net')
    cy.get('#user_password').type(`inHisHouseAtRlyehDeadCthulhuWaitsDreaming{enter}`)
  })

  it('Sends webhook on create new inventory', function() {
    cy.visit('/repositories')
    cy.get('#create-new-repository').click()
    cy.get('#repository_name').type(`${repositoryName}{enter}`)
    cy.wait(5000)
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
      cy.log(JSON.parse(response.body[0].payload))
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(repositoryName)
      // cy.expect(JSON.parse(response.body.payload)["payload"]["data"]["attributes"]["name"]).to.equal(repositoryName)
    })
  })

  it('Sends webhook on update inventory', function() {
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.rename-repo-option').click()
    cy.get('#repository_name').clear()
    cy.get('#repository_name').type(`${updatedRepositoryName}{enter}`)
    cy.wait(5000)
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
      cy.log(JSON.parse(response.body[0].payload))
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(updatedRepositoryName)
    })
  })

  it('Sends webhook on destroy inventory', function() {
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.delete-repo-option').click()
    cy.get('#confirm-repo-delete').click()
    cy.wait(5000)
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
      cy.log(JSON.parse(response.body[0].payload))
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(updatedRepositoryName)
    })
  })

})
