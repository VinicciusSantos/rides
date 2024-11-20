import { ValidationError } from 'class-validator';
import { ErrorParagraph, ParagraphsBuilder } from './utils/error-paragraph';

export class ConfigValidationError extends Error {
  constructor(errors: ValidationError[]) {
    super(
      ParagraphsBuilder.build([
        new ErrorParagraph()
          .newLine()
          .red('Your environment configuration is invalid.', {
            bold: true,
            indentLevel: 2,
          })
          .newLine()
          .red('Please check the following errors:', {
            bold: true,
            indentLevel: 2,
          })
          .newLine(2),
        ...ConfigValidationError.formatErrors(errors),
      ]),
    );

    this.name = 'ConfigValidationError';
  }

  private static formatErrors(
    errors: ValidationError[],
    indentLevel = 2,
  ): ErrorParagraph[] {
    return errors.flatMap((error) => {
      const paragraphs: ErrorParagraph[] = [];

      const childrenIndentLevel = {
        indentLevel: indentLevel + 2,
      };

      paragraphs.push(
        new ErrorParagraph().addProperty(
          new ErrorParagraph().red('Property', { indentLevel }),
          new ErrorParagraph().yellow(error.property, { bold: true }),
        ),
      );

      if (error.value) {
        paragraphs.push(
          new ErrorParagraph().addProperty(
            new ErrorParagraph().blue('Current Value', childrenIndentLevel),
            new ErrorParagraph().yellow(JSON.stringify(error.value), {
              bold: true,
            }),
          ),
        );
      }

      if (error.constraints) {
        for (const [constraint, message] of Object.entries(error.constraints)) {
          paragraphs.push(
            new ErrorParagraph()
              .addProperty(
                new ErrorParagraph().blue('Constraint', childrenIndentLevel),
                new ErrorParagraph().yellow(constraint, { bold: true }),
              )
              .addProperty(
                new ErrorParagraph().blue('Message', childrenIndentLevel),
                new ErrorParagraph().yellow(message, { bold: true }),
              ),
          );
        }
      }

      if (error.children && error.children.length) {
        paragraphs.push(
          new ErrorParagraph()
            .magenta('Children', childrenIndentLevel)
            .white(': ')
            .newLine(),
          ...ConfigValidationError.formatErrors(
            error.children,
            childrenIndentLevel.indentLevel + 2,
          ),
        );
      }

      paragraphs.push(new ErrorParagraph().newLine());

      return paragraphs;
    });
  }
}
