import { createHash } from "node:crypto";

export function computeDocumentId(relativePath: string): string {
  return createHash("sha256").update(relativePath).digest("hex");
}
