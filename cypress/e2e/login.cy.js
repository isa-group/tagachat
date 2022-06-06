describe('e2e login', () => {
  it('should navigate to the login page', () => {
    cy.visit('/login')
  })

  it('should display the heading', () => {
    cy.findByRole('heading', { name: /Log In/i }).should('be.visible')
  })

  it('should display the login form', () => {
    cy.findByRole('form').should('be.visible')
  })

  it('should display the login form fields', () => {
    cy.get('form').find('input').should('be.visible')
  })

  it('should display the login form submit button', () => {
    cy.get('form')
      .findByRole('button', { name: /log in/i })
      .should('be.visible')
  })

  it('should login with valid credentials', () => {
    const email = Cypress.env('EMAIL')
    const name = Cypress.env('NAME')
    const password = Cypress.env('PASSWORD')

    cy.log('Filling the form')
    cy.findByLabelText(/Email address/i)
      .clear()
      .type(email)
    cy.findByLabelText('Password').clear().type(password)

    cy.findByRole('button', { name: /log in/i }).click()

    cy.log('Checking the user is logged in')
    cy.findByText('Sessions').should('be.visible')
    cy.findByRole('button', { name: /import session/i }).should('exist')
    cy.findByText(name).should('exist')
  })
})
