# ADR-005: Manual RAG Orchestration

## Status

Accepted

---

## Context

The application requires a Retrieval-Augmented Generation (RAG) pipeline that performs document ingestion, semantic retrieval and answer generation.

Several orchestration frameworks such as LangChain and LlamaIndex could simplify implementation by abstracting these steps.

However, the primary goal of this assignment is to demonstrate engineering understanding rather than framework usage.

---

## Decision

Implement the complete RAG pipeline manually without using orchestration frameworks.

---

## Rationale

Implementing the retrieval pipeline manually keeps every processing step explicit and understandable.

The application controls:

- Document loading
- Text chunking
- Embedding generation
- Vector similarity search
- Context selection
- Prompt construction
- Response generation

This approach demonstrates understanding of Retrieval-Augmented Generation while reducing hidden abstractions.

---

## Alternatives Considered

### LangChain

#### Pros

- Fast development
- Rich ecosystem
- Many built-in integrations

#### Cons

- High abstraction
- Harder to explain internal processing
- Additional dependency

Decision:

Not selected because understanding the retrieval pipeline is considered more valuable than reducing implementation effort.

---

### LlamaIndex

#### Pros

- Excellent document indexing
- Rich retrieval abstractions

#### Cons

- Additional framework complexity
- Unnecessary features for this proof-of-concept

Decision:

Not selected because the project requirements can be satisfied with a simpler implementation.

---

## Consequences

### Positive

- Complete ownership of the pipeline
- Easier debugging
- Lower dependency footprint
- Better interview discussion
- Explicit implementation

### Negative

- More implementation effort
- More application code

---

## Why This Decision Fits This Project

The assignment evaluates engineering skills rather than familiarity with orchestration frameworks.

Implementing the pipeline manually demonstrates a deeper understanding of semantic retrieval and prompt construction while keeping the solution easy to explain during the technical interview.