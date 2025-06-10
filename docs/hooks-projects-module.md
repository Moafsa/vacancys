# Projects Module Hooks & Actions

This document describes all available hooks/actions in the Projects module. Use these hooks to extend or integrate with the platform (e.g., notifications, logs, analytics).

---

## List of Actions

### `project.create`
- **When:** Triggered when a new project is created.
- **Payload:** `{ project }`
- **Example:**
  ```js
  app.locals.actions['project.create'].push(async ({ project }) => {
    // Custom logic here
  });
  ```

### `project.update`
- **When:** Triggered when a project is updated.
- **Payload:** `{ project }`

### `proposal.submit`
- **When:** Triggered when a freelancer submits a proposal.
- **Payload:** `{ proposal }`
- **Example:**
  ```js
  app.locals.actions['proposal.submit'].push(async ({ proposal }) => {
    // Send notification, log, etc.
  });
  ```

### `proposal.statusChange`
- **When:** Triggered when a proposal status changes (accepted, rejected, negotiation, etc.).
- **Payload:** `{ proposal }`

### `contract.create`
- **When:** Triggered when a contract is created from an accepted proposal.
- **Payload:** `{ contract }`
- **Example:**
  ```js
  app.locals.actions['contract.create'].push(async ({ contract }) => {
    // Send notification, log, etc.
  });
  ```

### `contract.update`
- **When:** Triggered when a contract is updated (terms, status, negotiation).
- **Payload:** `{ contract }`

---

## How to Register a Listener

To listen to an action, push an async function to the corresponding array in `app.locals.actions`:

```js
app.locals.actions['proposal.submit'].push(async ({ proposal }) => {
  // Your custom logic here
});
```

## Payload Reference
- `project`: Project entity (see TypeScript interface)
- `proposal`: Proposal entity (see TypeScript interface)
- `contract`: Contract entity (see TypeScript interface)

## Best Practices
- Always handle errors in your listeners to avoid breaking the main flow.
- Use listeners for notifications, logging, analytics, or custom business logic.
- Keep listeners idempotent and side-effect safe.

---

For more details, see the Projects module source code and service layer. 