# Implementation Planning Prompt

## Objective

Your task is NOT to write code.

Your task is to analyze the requested feature and produce a detailed implementation plan before any code is generated.

---

## Read First

Read the following documents in order:

1. docs/requirements.md
2. docs/architecture.md
3. specs/000-system-overview.md
4. Current feature specification
5. Relevant ADR documents

These documents are the source of truth.

---

## Deliverables

Produce an implementation plan containing:

### 1. Summary

Summarize the feature in your own words.

---

### 2. Responsibilities

List the responsibilities of this feature.

---

### 3. Required Files

List every file that should be created or modified.

Do not generate code.

---

### 4. Dependency Graph

Describe how the new components depend on existing modules.

---

### 5. Public Interfaces

Describe:

- exported classes
- exported functions
- DTOs
- public methods

---

### 6. Risks

Identify:

- architectural risks
- implementation risks
- edge cases

---

### 7. Questions

Identify ambiguities before implementation.

Never guess missing requirements.

---

## Constraints

Do not write code.

Do not create placeholder implementations.

Wait for approval before continuing.