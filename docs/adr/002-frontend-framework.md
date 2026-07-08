# ADR-002: Frontend Framework

## Status

Accepted

---

## Context

The frontend should provide a lightweight user interface for interacting with the AI-powered Question & Answer service while remaining easy to maintain and extend.

---

## Decision

Use Next.js with React and TypeScript.

---

## Rationale

Next.js provides an excellent developer experience, a well-organized project structure and strong TypeScript integration.

Although advanced features such as Server Components or Server-Side Rendering are not required for this proof-of-concept, choosing Next.js provides a scalable foundation without introducing significant complexity.

---

## Alternatives Considered

### React + Vite

#### Pros

- Faster startup
- Smaller tooling footprint
- Very simple configuration

#### Cons

- Less opinionated project structure
- Fewer built-in capabilities for future expansion

Decision:

Not selected because Next.js offers a better long-term project structure while remaining simple enough for this assignment.

---

### Plain HTML / JavaScript

#### Pros

- Minimal dependencies
- Simple setup

#### Cons

- Poor maintainability
- Limited scalability
- No type safety

Decision:

Not selected because the project benefits significantly from a component-based architecture and TypeScript.

---

## Consequences

### Positive

- Excellent developer experience
- Strong TypeScript support
- Component-based architecture
- Future extensibility

### Negative

- Slightly larger framework footprint than React + Vite

---

## Why This Decision Fits This Project

The assignment focuses on software engineering rather than frontend optimization.

Next.js provides enough structure to keep the codebase maintainable while remaining simple enough for a five-day proof-of-concept.