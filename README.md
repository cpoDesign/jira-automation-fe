# jira-automation-fe

## Regenerating the API Client from Swagger

To regenerate the TypeScript API client from the latest Swagger (OpenAPI) specification, run the following command in your project root:

```
npm run generate:api
```

This will fetch the latest `swagger.json` from the backend and update the generated API client in `src/api/generated`.

- The script uses [openapi-typescript-codegen](https://www.npmjs.com/package/openapi-typescript-codegen) to generate a type-safe API client.
- You can use the generated services and types for all backend API calls.

**Tip:** Run this command any time the backend API changes or the swagger.json is updated.
