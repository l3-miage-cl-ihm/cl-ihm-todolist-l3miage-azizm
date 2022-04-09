import { page } from "cypress/support/todolist.page";
describe('My First Test', () => {
    it('Visits the initial project page', () => {
      cy.visit('/')
     page.countNumberItem(0);
     page.onFooter(0);
    })
  })

