import { CONSOLE_COLORS } from './colors';

interface TextOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  indentLevel?: number;
}

export class ParagraphsBuilder {
  public static build(paragraphs: ErrorParagraph[]): string {
    return paragraphs.map((paragraph) => paragraph.reset().toString()).join('');
  }
}

export class ErrorParagraph {
  private content = '';

  constructor() {}

  public red(text: string, options: TextOptions = {}): ErrorParagraph {
    this.content += this.applyOptions(CONSOLE_COLORS.red + text, options);
    return this.reset();
  }

  public yellow(text: string, options: TextOptions = {}): ErrorParagraph {
    this.content += this.applyOptions(CONSOLE_COLORS.yellow + text, options);
    return this.reset();
  }

  public blue(text: string, options: TextOptions = {}): ErrorParagraph {
    this.content += this.applyOptions(CONSOLE_COLORS.blue + text, options);
    return this.reset();
  }

  public white(text: string, options: TextOptions = {}): ErrorParagraph {
    this.content += this.applyOptions(CONSOLE_COLORS.white + text, options);
    return this.reset();
  }

  public magenta(text: string, options: TextOptions = {}): ErrorParagraph {
    this.content += this.applyOptions(CONSOLE_COLORS.magenta + text, options);
    return this.reset();
  }

  public reset(): ErrorParagraph {
    this.content += '\x1b[0m';
    return this;
  }

  public newLine(quantity: number = 1): ErrorParagraph {
    this.content += '\n'.repeat(quantity);
    return this.reset();
  }

  public addProperty(
    key: ErrorParagraph,
    value: ErrorParagraph,
  ): ErrorParagraph {
    this.content += `${key.toString()}${CONSOLE_COLORS.white}: ${value.toString()}`;
    return this.newLine().reset();
  }

  public toString(): string {
    return this.content;
  }

  private applyOptions(text: string, options: TextOptions): string {
    let formattedText = text;

    if (options.bold) {
      formattedText = `\x1b[1m${formattedText}`;
    }

    if (options.italic) {
      formattedText = `\x1b[3m${formattedText}`;
    }

    if (options.underline) {
      formattedText = `\x1b[4m${formattedText}`;
    }

    if (options.indentLevel) {
      formattedText = `${' '.repeat(options.indentLevel)}${formattedText}`;
    }

    return formattedText;
  }
}
