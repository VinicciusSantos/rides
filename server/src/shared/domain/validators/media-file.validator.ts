import crypto from 'crypto';

export interface MediaFileValidatorProps {
  raw_name: string;
  mime_type: string;
  size: number;
}

export class MediaFileValidator {
  constructor(
    private readonly max_size: number,
    private readonly valid_mime_types: string[],
  ) {}

  public validate(props: MediaFileValidatorProps) {
    const { raw_name, mime_type, size } = props;
    if (!this.validateSize(size)) {
      throw new InvalidMediaFileSizeError(size, this.max_size);
    }

    if (!this.validateMimeType(mime_type)) {
      throw new InvalidMediaFileMimeTypeError(mime_type, this.valid_mime_types);
    }

    return { name: this.generateRandomName(raw_name) };
  }

  private validateSize(size: number): boolean {
    return size <= this.max_size;
  }

  private validateMimeType(mime_type: string): boolean {
    return this.valid_mime_types.includes(mime_type);
  }

  private generateRandomName(raw_name: string): string {
    const extension = raw_name.split('.').pop();

    return (
      crypto
        .createHash('sha256')
        .update(raw_name + Math.random() + Date.now())
        .digest('hex') +
      '.' +
      extension
    );
  }
}

export class InvalidMediaFileSizeError extends Error {
  constructor(actual_size: number, max_size: number) {
    super(`Invalid media file size: ${actual_size} > ${max_size}`);
  }
}

export class InvalidMediaFileMimeTypeError extends Error {
  constructor(actual_mime_type: string, valid_mime_types: string[]) {
    super(
      `Invalid media file mime type: ${actual_mime_type} not in ${valid_mime_types.join(', ')}`,
    );
  }
}
