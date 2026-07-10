# Architecture Decisions

## Overview

The AI Document Q&A system is designed as a modular monolith following Clean Architecture principles. The goal is to keep business logic independent from frameworks, databases, and AI providers.

---

## Why Express?

Express was selected instead of NestJS because the project is intentionally lightweight. The application has a small number of HTTP endpoints and does not require a large dependency injection framework.

Benefits include:

- minimal overhead
- fast startup
- simple routing
- easy testing
- fewer abstractions

---

## Clean Architecture

The backend is divided into four layers:

- Domain
- Application
- Infrastructure
- Presentation

The Domain layer contains business models and interfaces.

The Application layer contains use cases that orchestrate business operations.

The Infrastructure layer provides implementations for external systems such as Google Gemini and LanceDB.

The Presentation layer exposes REST endpoints through Express.

Dependencies always point inward toward the Domain.

---

## AI Provider

Google Gemini was selected because it provides both embedding generation and answer generation using the same API ecosystem.

Two models are currently used:

- text-embedding-004 for embeddings
- gemini-2.5-flash for answer generation

---

## Vector Database

LanceDB stores document embeddings locally.

Reasons for choosing LanceDB:

- embedded database
- no server installation
- fast local similarity search
- simple TypeScript integration

---

## Chunking Strategy

Documents are divided into chunks before indexing.

Configuration:

- Chunk size: 800 characters
- Chunk overlap: 200 characters

Overlap preserves context across chunk boundaries.

---

## Error Handling

Errors are classified into categories:

- validation errors
- embedding generation errors
- vector store errors
- answer generation errors
- unexpected internal errors

Every request returns a structured JSON error response.

---

## Extensibility

The system was designed around interfaces.

Future implementations may replace:

- Google Gemini
- LanceDB
- FileSystemDocumentLoader

without modifying business logic.

Examples include:

- OpenAI
- Azure OpenAI
- Pinecone
- Weaviate
- Amazon S3 document loader

---

## Future Improvements

Potential future enhancements include:

- PDF extraction
- DOCX support
- streaming responses
- authentication
- authorization
- conversation memory
- background indexing
- incremental updates
- document versioning