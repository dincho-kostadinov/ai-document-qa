# ADR-004: LLM Provider

## Status

Accepted

---

## Context

The application requires a Large Language Model (LLM) capable of generating concise, context-aware answers grounded in retrieved enterprise documentation.

The solution should integrate easily with the backend, provide high-quality responses, support embeddings and remain suitable for a five-day proof-of-concept.

---

## Decision

Use Google Gemini 2.5 Flash together with the Google Embedding API.

---

## Rationale

Using Gemini for both text generation and embeddings simplifies the architecture by relying on a single provider and SDK.

Gemini offers strong reasoning capabilities, good latency and a generous free tier suitable for development and evaluation.

This approach reduces operational complexity while providing sufficient quality for the project requirements.

---

## Alternatives Considered

### OpenAI GPT-4.1 / GPT-4o

#### Pros

- Excellent reasoning capabilities
- Mature SDK
- Strong documentation

#### Cons

- Higher operational cost
- Requires paid API usage

Decision:

Not selected because Gemini provides comparable capabilities while simplifying development within the project constraints.

---

### Ollama (Local Models)

#### Pros

- Fully local execution
- No external API dependency
- Better privacy

#### Cons

- Requires downloading and running local models
- Higher hardware requirements
- More difficult for reviewers to reproduce

Decision:

Not selected because the assignment prioritizes software engineering over local AI infrastructure.

---

## Consequences

### Positive

- Single provider
- Simple SDK integration
- Shared authentication
- Good response quality
- Low operational complexity

### Negative

- Requires internet connectivity
- External API dependency
- Subject to provider rate limits

---

## Why This Decision Fits This Project

Using Gemini keeps the implementation simple, reproducible and easy to evaluate while providing all functionality required by the assignment.