# ADR-001: Backend Framework

## Status

Accepted

---

## Context

The project requires a lightweight backend framework capable of exposing a REST API, orchestrating the Retrieval-Augmented Generation (RAG) pipeline, and integrating with external AI services.

The solution is expected to be completed within five days while remaining maintainable, easy to understand and straightforward to extend.

---

## Decision

Use Express.js with TypeScript.

---

## Rationale

Express provides a mature ecosystem, excellent documentation and minimal framework overhead.

For this proof-of-concept, Express enables rapid development while remaining flexible enough to support a clean modular architecture.

The simplicity of Express aligns with the project goal of prioritizing readability, maintainability and delivery speed over framework features that are unnecessary for the current scope.

---

## Alternatives Considered

### Fastify

#### Pros

- Better runtime performance
- Built-in schema support
- Lower memory footprint

#### Cons

- Performance advantages are negligible for this proof-of-concept.
- Smaller middleware ecosystem.

Decision:

Not selected because performance is not a primary concern for this assignment.

---

### Hono

#### Pros

- Lightweight
- Excellent TypeScript support
- Modern API design

#### Cons

- Smaller ecosystem
- Less mature community support

Decision:

Not selected because Express offers a more established ecosystem and is widely adopted in enterprise environments.

---

## Consequences

### Positive

- Rapid development
- Mature ecosystem
- Easy debugging
- Large middleware ecosystem
- Minimal boilerplate

### Negative

- Architecture conventions rely on developer discipline
- Dependency injection remains manual when needed

---

## Why This Decision Fits This Project

The primary objective is to deliver a clean, maintainable proof-of-concept within five days.

Express minimizes framework complexity while providing all capabilities required by the architecture.

The decision prioritizes implementation speed, readability and maintainability over unnecessary framework features.