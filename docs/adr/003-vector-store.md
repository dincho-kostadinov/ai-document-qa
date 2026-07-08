# ADR-003: Vector Store

## Status

Accepted

---

## Context

The application requires persistent semantic search capabilities without introducing unnecessary infrastructure or operational complexity.

The vector database should support local development, easy setup and efficient similarity search.

---

## Decision

Use LanceDB as the local vector database.

---

## Rationale

LanceDB provides persistent local storage, straightforward Node.js integration and efficient vector similarity search.

It satisfies all project requirements while keeping infrastructure lightweight and easy for reviewers to run locally.

---

## Alternatives Considered

### HNSWLib

#### Pros

- Extremely fast
- Lightweight
- Simple integration

#### Cons

- In-memory only
- Limited persistence capabilities

Decision:

Not selected because persistence is preferred for this project.

---

### ChromaDB

#### Pros

- Rich ecosystem
- Popular in RAG applications
- Persistent storage

#### Cons

- Requires an additional service
- Higher operational complexity

Decision:

Not selected because the additional infrastructure does not provide sufficient value for a five-day proof-of-concept.

---

### Pinecone

#### Pros

- Production-ready managed service
- Excellent scalability

#### Cons

- External cloud dependency
- Requires account setup
- Unnecessary operational overhead

Decision:

Not selected because the project should remain fully self-contained and easy to evaluate locally.

---

## Consequences

### Positive

- Local persistence
- Minimal setup
- Easy Docker integration
- Simple local development

### Negative

- Not intended for large-scale production deployments

---

## Why This Decision Fits This Project

The project prioritizes simplicity, reproducibility and minimal infrastructure.

LanceDB offers an excellent balance between functionality and operational simplicity while remaining appropriate for a proof-of-concept implementation.