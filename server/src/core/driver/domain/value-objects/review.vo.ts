import { ValueObject } from '../../../../shared/domain/value-objects';

export interface ReviewConstructorProps {
  rating: number;
  comment: string;
}

export interface ReviewJSON {
  rating: number;
  comment: string;
}

export class Review extends ValueObject {
  private readonly _rating: number;
  private readonly _comment: string;

  public get rating(): number {
    return this._rating;
  }

  public get comment(): string {
    return this._comment;
  }

  constructor(props: ReviewConstructorProps) {
    super();
    this._rating = props.rating;
    this._comment = props.comment;
  }

  public toJSON(): ReviewJSON {
    return {
      rating: this.rating,
      comment: this.comment,
    };
  }
}
