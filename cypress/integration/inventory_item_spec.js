var faker = require('faker');

describe('Inventory Items', function() {

  const repositoryName = faker.name.findName()
  const updatedRepositoryName = faker.name.findName()
  const rabbitMQoptions = {
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
  }
  let repositoryColumnName = faker.name.findName()
  let inventoryItemName = faker.name.findName()
  let updatedItemName = faker.name.findName()

  function getMessage(){
    cy.request(rabbitMQoptions).then((response) => {
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
    cy.wait(2000)
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.repository-cog > .dropdown-menu > :nth-child(2) > a').click()
    cy.wait(2000)
    cy.get('button[data-action=new-column-modal]').click()
    cy.get('#repository_column_name').type(`${repositoryColumnName}{enter}`)
    cy.get('.btn-success').click()
    getMessage()
  })

  beforeEach(function(){
    Cypress.Cookies.preserveOnce('_scinote_session', 'remember_user_token')
  })

  after(function(){
    cy.visit('/repositories')
    cy.get('#repository-acitons-dropdown').click()
    cy.get('.delete-repo-option').click()
    cy.get('#confirm-repo-delete').click()
    getMessage()
  })

  it('Sends webhook on CREATE new inventory item', function() {
    cy.visit('/repositories')
    cy.get('#addRepositoryRecord').click()
    cy.get('input[name=name]').type(inventoryItemName)
    cy.get('input[data-object=repository_cell]').type(faker.name.findName())
    cy.get(':nth-child(1) > #saveRecord').click()
    cy.wait(2000)
    cy.request(rabbitMQoptions).then((response) => {
      cy.log(JSON.parse(response.body[0].payload))
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_row_created")
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(inventoryItemName)
    })
  })


  it('Sends webhook on UPDATE new inventory item', function() {
    cy.visit('/repositories')
    cy.get('.repository-row-selector').check()
    cy.get('#editRepositoryRecord').click()
    cy.get('input[name=name]').clear()
    cy.get('input[name=name]').type(updatedItemName)
    cy.get('input[data-object=repository_cell]').clear()
    cy.get('input[data-object=repository_cell]').type(faker.name.findName())
    cy.get(':nth-child(1) > #saveRecord').click()
    cy.wait(2000)
    cy.request(rabbitMQoptions).then((response) => {
      cy.log(response)
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_row_updated")
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(updatedItemName)
    })
  })

  it('Sends webhook on DESTROY inventory item', function() {
    cy.visit('/repositories')
    cy.get('.repository-row-selector').check()
    cy.get('#deleteRepositoryRecordsButton').click()
    cy.get('.btn-danger').click()
    cy.wait(2000)
    cy.request(rabbitMQoptions).then((response) => {
      cy.log(response)
      cy.expect(JSON.parse(response.body[0].payload).event_name).to.equal("repository_row_destroyed")
      cy.expect(JSON.parse(response.body[0].payload).payload.data.attributes.name).to.equal(updatedItemName)
    })
  })


})
