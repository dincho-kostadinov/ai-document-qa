# AI-Powered Document Q&A Service for Enterprise Knowledge Management

## Overview
CogniCorp Solutions provides enterprise software that helps large companies manage their internal knowledge bases. One of their key user personas is Alex, a Product Manager who frequently needs to find historical context from a vast and disorganized library of design documents, user feedback tickets, and market research reports. Simple keyword search is inefficient, often missing semantically related documents. Alex needs a way to ask natural language questions (e.g., "What were the main user complaints about the mobile login flow last year?") and get a concise, synthesized answer based on the existing documentation.

Your task is to build a proof-of-concept for an AI-powered Question & Answering service. You will create a full-stack application that allows a user to ask questions against a small, provided set of documents. The backend should implement a Retrieval-Augmented Generation (RAG) pipeline: it will ingest the documents, store them in a way that enables semantic search (i.e., a vector store), and use a Large Language Model (LLM) to generate answers based on the most relevant document snippets retrieved for a given user query.

The frontend will be a simple web interface with a text input for the user's question and a display area for the generated answer. The focus is on a well-designed, functional system, not a polished UI. We want to see your approach to system architecture, API design, and how you connect the frontend and backend components. A good solution will be well-documented, easy to run, and include thoughtful trade-offs explained in the README.

## Deliverables
- A public GitHub repository URL containing your complete solution.
- A backend service, written in TypeScript/Node.js, that exposes an API for querying the document set.
- A simple web-based frontend (e.g., using React, Next.js, or plain HTML/JS) that consumes the backend API to provide a user interface for asking questions.
- A `README.md` file that explains your design choices, trade-offs, and provides clear instructions on how to set up and run the project locally.
- Your AI assistant conversation history (e.g., a transcript or exported chat log) committed to the repository.

## Suggested tools / libraries
- Backend Framework: Node.js with Express or Fastify
- Frontend Framework: React + Vite, Next.js, or plain HTML/CSS/JS with the Fetch API
- LLMs / Embeddings: A local model runner like Ollama (with Llama3, Mistral, etc.) or a free tier of a cloud API (e.g., Cohere, OpenAI, Gemini).
- Vector Storage: An in-memory or file-based solution like LanceDB, ChromaDB, or a library like HNSWlib.js to avoid heavy setup.
- Containerization: Docker and Docker Compose for easy setup and dependency management.

## On AI assistants & follow-up
- We expect you to use AI assistants. The goal is to see how you leverage modern tools to be effective, not to test memorization.
- Be prepared to walk us through your code and explain the design decisions and trade-offs you made during the follow-up interview.
- Your submission MUST include your AI assistant conversation history (e.g., VS Code Copilot chat export, a Claude transcript). Please also add a note in your README detailing which tools you used and for what parts of the project.
- We value a well-reasoned, working prototype that demonstrates your skills over a complex but incomplete solution. Scope accordingly.

## How to submit
Reply to this email with **one** public GitHub repository or gist URL containing your solution.