# ADR-007: Deployment Strategy

## Status

Accepted

---

## Context

The reviewers should be able to run the project quickly with minimal setup.

The deployment process should be reproducible across different development environments.

---

## Decision

Use Docker and Docker Compose for local development.

---

## Rationale

Containerization ensures a consistent execution environment while minimizing installation issues.

Using Docker Compose allows the frontend and backend to be started with a single command.

---

## Alternatives Considered

### Manual Local Setup

#### Pros

- No Docker knowledge required

#### Cons

- Environment inconsistencies
- Manual dependency installation

Decision:

Not selected because reproducibility is a project requirement.

---

## Consequences

### Positive

- Consistent environments
- Easy onboarding
- Reproducible setup
- Simple evaluation

### Negative

- Requires Docker to be installed

---

## Why This Decision Fits This Project

The assignment explicitly recommends containerization.

Docker Compose provides the simplest and most reliable way for reviewers to run the application locally.