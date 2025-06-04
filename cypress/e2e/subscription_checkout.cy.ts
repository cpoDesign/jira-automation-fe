/// <reference types="cypress" />

function loginIfNeeded() {
  // Optionally, add login logic here if your app requires authentication before accessing /subscription
}

describe("Subscription Checkout Flow", () => {
  it("should start checkout when a subscription is selected (assumes org is already configured)", () => {
    loginIfNeeded();
    cy.log("Visiting /subscription");
    cy.visit("/subscription");

    cy.log("Intercepting plans API call");
    cy.intercept("GET", "/api/subscriptions").as("getPlans");

    cy.log("Waiting for plans API call to complete");
    cy.wait("@getPlans");

    cy.log("Waiting for plans to load");
    cy.contains("Choose a Subscription").should("be.visible");

    // Select the Bronze plan by its label and click its Subscribe button
    cy.contains(".font-semibold.text-lg", "Bronze")
      .parents(".border.rounded")
      .within(() => {
        cy.contains("button", "Subscribe").click();
      });

    cy.intercept("POST", "/api/checkout").as("checkout");

    cy.log("Waiting for checkout API call");
    cy.wait("@checkout").then((interception) => {
      cy.log(
        "Checkout request body: " + JSON.stringify(interception.request.body)
      );
      expect(interception.request.body).to.have.property("priceId");
      expect(interception.request.body).to.have.property("userEmail");
    });

    cy.log("Checking for redirect or UI feedback");
    cy.contains("Redirecting to checkout...").should("be.visible");
  });
});
