# Element CRM Development Rules

## Project Goal

Develop the existing Element CRM into a production-ready mobile CRM application.

Do not rewrite the project from scratch.

---

## Architecture

- Preserve the existing architecture.
- Reuse existing components whenever possible.
- Do not rename files without necessity.
- Do not move files unless requested.
- Do not install new dependencies without approval.

---

## UI Rules

- Premium dark interface.
- Mobile First.
- Android + iPhone compatible.
- Safe Area support.
- Consistent spacing.
- Consistent typography.
- Consistent icons.
- Glassmorphism style.
- Smooth animations (200–300 ms).

---

## Forms

Complex forms must open as separate pages.

Do not use Modal, Dialog or BottomSheet for:

- Create Object
- Edit Object
- Create Transaction
- Edit Transaction
- Create Event
- Edit Event
- Create Material
- Edit Material

---

## Navigation

Always use the existing navigation.

Do not break routing.

Back button must always return to the previous screen.

---

## Code Style

Keep components small.

Avoid duplicated code.

Use existing UI components first.

Only modify files related to the task.

---

## Before finishing

Always:

- verify TypeScript
- verify build
- list modified files
- explain changes
