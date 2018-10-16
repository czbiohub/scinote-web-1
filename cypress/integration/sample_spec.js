describe('My First Test', function() {
  beforeEach(function(){
    cy.visit('/users/sign_in')
    cy.get('#user_email').type('admin@scinote.net')
    cy.get('#user_password').type(`inHisHouseAtRlyehDeadCthulhuWaitsDreaming{enter}`)
  })

  it('Sends webhook on create new inventory', function() {
    cy.visit('http://localhost:3000/repositories')
    cy.get('#create-new-repository').click()
    cy.get('#repository_name').type(`New Inventory{enter}`)
  })
})
