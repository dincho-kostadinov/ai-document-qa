# API Reference

## Overview

The backend exposes a REST API for asking questions against indexed documentation.

Base URL

http://localhost:4000

---

## Health Check

GET /health

Response

```json
{
  "status": "ok"
}
```

---

## Ask Question

POST /api/questions

Request Body

```json
{
  "question": "How does the chunking algorithm work?"
}
```

---

## Successful Response

Status

200 OK

Example

```json
{
  "answer": "Documents are split into overlapping chunks before embeddings are generated.",
  "grounded": true,
  "sources": [
    {
      "documentId": "architecture-decisions",
      "fileName": "architecture-decisions.md",
      "sourcePath": "architecture-decisions.md"
    }
  ]
}
```

---

## Validation Rules

The request must satisfy the following rules:

- question is required
- question must be a string
- question cannot be empty
- whitespace-only questions are rejected

---

## Error Responses

### Validation Error

Status

400 Bad Request

```json
{
  "error": {
    "message": "Question is required",
    "code": "VALIDATION_ERROR"
  }
}
```

---

### Embedding Error

Status

500 Internal Server Error

```json
{
  "error": {
    "message": "Failed to generate embeddings",
    "code": "INTERNAL_ERROR"
  }
}
```

---

### Answer Generation Error

Status

500 Internal Server Error

```json
{
  "error": {
    "message": "Failed to generate answer",
    "code": "INTERNAL_ERROR"
  }
}
```

---

### Unexpected Error

Status

500 Internal Server Error

```json
{
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR"
  }
}
```

---

## Processing Flow

Every request follows the same pipeline.

1. Validate request
2. Generate an embedding for the question
3. Search the vector database
4. Retrieve the most relevant chunks
5. Build the prompt
6. Generate an answer with Gemini
7. Return the answer and citations

---

## Source Attribution

Every successful answer includes a list of source documents.

Each source contains:

- documentId
- fileName
- sourcePath

This allows users to verify where the information originated.

---

## Current Limitations

Current limitations include:

- Markdown and text documents only
- no PDF support
- no authentication
- no conversation history
- no streaming responses
- local vector database only