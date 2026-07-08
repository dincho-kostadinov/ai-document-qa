# ADR-006: Project Structure

## Status

Accepted

---

## Context

The project contains multiple application layers, documentation artifacts and feature specifications.

A clear structure is required to keep implementation, architecture and specifications organized.

---

## Decision

Organize the repository as a monorepo with separate application, documentation and specification directories.

---

## Rationale

Separating implementation from documentation improves maintainability and allows the project to follow a Spec-Driven Development workflow.

The structure clearly distinguishes between:

- application code
- architectural documentation
- feature specifications
- AI workflows

---

## Repository Structure

```text
apps/
    backend/
    frontend/

docs/
    adr/
    diagrams/

specs/
    prompts/

README.md
CLAUDE.md
```

---

## Alternatives Considered

### Flat Repository Structure

#### Pros

- Simpler initially

#### Cons

- Poor scalability
- Documentation mixed with implementation

Decision:

Not selected because the project already contains multiple architectural artifacts.

---

## Consequences

### Positive

- Better organization
- Easier navigation
- Clear separation of responsibilities

### Negative

- Slightly more folders

---

## Why This Decision Fits This Project

The project intentionally follows Spec-Driven Development.

Separating specifications, documentation and implementation improves clarity without introducing unnecessary complexity.