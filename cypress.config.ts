import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});
