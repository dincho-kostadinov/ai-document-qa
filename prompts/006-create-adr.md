# Architecture Decision Record (ADR) Creation Prompt

## Objective

You are acting as a Senior Software Architect.

Your task is to determine whether the implementation introduces a new architectural decision.

If it does, create a new Architecture Decision Record (ADR) following the project's ADR template.

If no architectural decision has been made, explicitly state that no ADR is required.

---

## Read First

Read the following documents:

1. docs/architecture.md
2. Existing ADR documents
3. Current feature specification
4. Implementation changes

---

## Responsibilities

Determine whether any of the following has changed:

- Architecture
- Frameworks
- External libraries
- Data storage
- API design
- Communication patterns
- Deployment strategy
- Security model
- Project structure
- Performance strategy
- Error handling strategy
- Logging strategy
- Configuration strategy

If none of these changed:

Output:

"No new Architecture Decision Record is required."

---

## If an ADR is required

Create the document using the following template.

# ADR-XXX: Decision Title

## Status

Accepted

---

## Context

Explain the problem that required the decision.

Describe why the existing architecture was insufficient.

---

## Decision

Describe the chosen solution.

Keep it concise and explicit.

---

## Rationale

Explain why this solution was selected.

Reference project constraints when appropriate.

---

## Alternatives Considered

For each alternative provide:

### Option

#### Pros

#### Cons

Decision:

Explain why it was not selected.

---

## Consequences

### Positive

Describe the expected benefits.

### Negative

Describe trade-offs and limitations.

---

## Why This Decision Fits This Project

Explain why the decision is appropriate for this specific proof-of-concept.

Avoid generic statements.

---

## Future Considerations

Describe situations in which this decision should be revisited.

---

## ADR Quality Checklist

Before finalizing, verify:

- The decision is architectural rather than implementation-specific.
- The rationale is based on project requirements.
- Alternatives are realistic.
- Trade-offs are clearly documented.
- The decision aligns with existing ADRs.
- No existing ADR already covers the same decision.

---

## Constraints

Do not create ADRs for:

- Variable names
- Folder names
- Refactoring
- Minor implementation details
- Small utility classes
- Temporary experiments

Only create ADRs for decisions that materially affect the system architecture.

---

## Output

If required:

1. Recommend the next ADR number.
2. Generate the complete ADR document.
3. Explain why this ADR should exist.

Otherwise output:

"No architectural decision requiring an ADR was detected."