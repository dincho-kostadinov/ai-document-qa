# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository currently contains only the assignment brief
([prescreen-brief-dincho-kostadinov.md](prescreen-brief-dincho-kostadinov.md)). No application code exists yet.
Once the project is scaffolded, this file should be updated with real build/lint/test commands and
the actual architecture (replace this section and the placeholders below).

## What this project is

A take-home proof-of-concept: a Retrieval-Augmented Generation (RAG) Q&A service for enterprise
knowledge management. A user asks a natural-language question against a small, fixed set of provided
documents (design docs, feedback tickets, market research reports) and receives a concise answer
synthesized from the most relevant retrieved snippets.

## Required deliverables (per the brief)

- A backend service in TypeScript/Node.js exposing an API for querying the document set.
- A simple web frontend (React+Vite, Next.js, or plain HTML/JS) that consumes that API — functional
  over polished.
- A `README.md` explaining design choices/trade-offs and clear local setup/run instructions.
- The AI assistant conversation history/transcript committed to the repo (this is a graded requirement,
  not optional).

## Intended architecture (RAG pipeline)

The backend should implement, at minimum, these stages:

1. **Ingest** — load the provided documents and chunk them.
2. **Embed & store** — generate embeddings and persist them in a vector store enabling semantic search
   (suggested: LanceDB, ChromaDB, or HNSWlib.js — favor in-memory/file-based options to avoid heavy
   infra setup).
3. **Retrieve** — given a user query, embed it and fetch the most relevant chunks from the vector store.
4. **Generate** — pass the retrieved snippets + question to an LLM (local via Ollama, or a cloud API
   free tier such as OpenAI/Cohere/Gemini) to produce the final synthesized answer.

The frontend is a thin client: a text input for the question and a display area for the answer, calling
the backend's query API.

## Scope guidance

The brief explicitly values "a well-reasoned, working prototype... over a complex but incomplete
solution." Prefer the simplest viable choice at each pipeline stage (in-memory vector store, minimal
UI, no auth/multi-user concerns) and document trade-offs in the README rather than building them out.
