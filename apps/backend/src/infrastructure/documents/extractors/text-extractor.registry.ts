export type TextExtractor = (filePath: string) => Promise<string>;

export class TextExtractorRegistry {
  private readonly extractors = new Map<string, TextExtractor>();

  register(extension: string, extractor: TextExtractor): void {
    const normalized = normalizeExtension(extension);

    if (this.extractors.has(normalized)) {
      throw new Error(`An extractor is already registered for "${normalized}"`);
    }

    this.extractors.set(normalized, extractor);
  }

  resolve(extension: string): TextExtractor | undefined {
    return this.extractors.get(normalizeExtension(extension));
  }

  supportedExtensions(): string[] {
    return [...this.extractors.keys()];
  }
}

function normalizeExtension(extension: string): string {
  const withDot = extension.startsWith(".") ? extension : `.${extension}`;
  return withDot.toLowerCase();
}
