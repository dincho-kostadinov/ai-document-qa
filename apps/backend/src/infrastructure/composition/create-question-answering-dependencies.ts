import { GoogleGenAI } from "@google/genai";

import { GenerateAnswerUseCase } from "../../application/answers/generate-answer.use-case";
import { IndexDocumentsUseCase } from "../../application/indexing/index-documents.use-case";
import { SearchSimilarChunksUseCase } from "../../application/search/search-similar-chunks.use-case";
import type { Env } from "../config/env";
import { createDefaultTextExtractorRegistry } from "../documents/extractors/default-text-extractor-registry";
import { FileSystemDocumentLoader } from "../documents/file-system-document-loader";
import { GoogleEmbeddingProvider } from "../embeddings/google-embedding-provider";
import { GoogleAnswerGenerator } from "../answers/google-answer-generator";
import { LanceDbVectorStore } from "../vector-store/lancedb-vector-store";

export interface AppDependencies {
  indexDocuments: IndexDocumentsUseCase;
  searchSimilarChunks: SearchSimilarChunksUseCase;
  generateAnswer: GenerateAnswerUseCase;
}

export function createAppDependencies(env: Env): AppDependencies {
  const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  const embeddings = new GoogleEmbeddingProvider(genAI, env.GOOGLE_EMBEDDINGS_MODEL);
  const vectorStore = new LanceDbVectorStore(env.VECTOR_STORE_PATH);
  const answerGenerator = new GoogleAnswerGenerator(genAI, env.GEMINI_MODEL, env.GEMINI_TEMPERATURE);

  const loader = new FileSystemDocumentLoader({
    documentsPath: env.DOCUMENTS_PATH,
    extractors: createDefaultTextExtractorRegistry(),
  });

  const indexDocuments = new IndexDocumentsUseCase({
    loader,
    embeddings,
    vectorStore,
    chunkingOptions: { maxChunkSize: env.CHUNK_SIZE, overlap: env.CHUNK_OVERLAP },
  });

  const searchSimilarChunks = new SearchSimilarChunksUseCase({
    embeddings,
    vectorStore,
    searchOptions: { topK: env.SIMILARITY_TOP_K, minScore: env.SIMILARITY_THRESHOLD },
  });

  const generateAnswer = new GenerateAnswerUseCase({ generator: answerGenerator });

  return { indexDocuments, searchSimilarChunks, generateAnswer };
}
