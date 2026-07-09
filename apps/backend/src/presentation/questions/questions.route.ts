import { Router } from "express";

import type { GenerateAnswerUseCase } from "../../application/answers/generate-answer.use-case";
import type { SearchSimilarChunksUseCase } from "../../application/search/search-similar-chunks.use-case";
import { validateBody } from "../middleware/validate-body.middleware";

import { toAnswerResponseDto } from "./answer-response.dto";
import type { QuestionRequestDto } from "./question-request.dto";
import { questionRequestSchema } from "./question-request.dto";

export interface QuestionsRouterDeps {
  search: SearchSimilarChunksUseCase;
  answer: GenerateAnswerUseCase;
}

export function createQuestionsRouter(deps: QuestionsRouterDeps): Router {
  const router = Router();

  router.post("/api/questions", validateBody(questionRequestSchema), (req, res, next) => {
    const { question } = req.body as QuestionRequestDto;

    deps.search
      .search(question)
      .then((chunks) => deps.answer.generate(question, chunks))
      .then((answer) => {
        res.status(200).json(toAnswerResponseDto(answer));
      })
      .catch(next);
  });

  return router;
}
