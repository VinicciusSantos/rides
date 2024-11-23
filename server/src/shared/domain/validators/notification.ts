import { isString } from 'lodash';

export class Notification {
  public errors = new Map<string, string[] | string>();

  public addError(error: string, field?: string) {
    if (field) {
      const errors = (this.errors.get(field) ?? []) as string[];
      errors.indexOf(error) === -1 && errors.push(error);
      this.errors.set(field, errors);
    } else {
      this.errors.set(error, error);
    }
  }

  public setError(error: string | string[], field?: string) {
    if (field) {
      this.errors.set(field, Array.isArray(error) ? error : [error]);
    } else {
      if (Array.isArray(error)) {
        error.forEach((value) => {
          this.errors.set(value, value);
        });
        return;
      }
      this.errors.set(error, error);
    }
  }

  public hasErrors(): boolean {
    return this.errors.size > 0;
  }

  public copyErrors(notification: Notification): void {
    notification.errors.forEach((value, field) => {
      this.setError(value, field);
    });
  }

  public toJSON() {
    const errors: Array<string | Record<string, string[]>> = [];
    this.errors.forEach((value, key) => {
      if (isString(value)) {
        errors.push(value);
      } else {
        errors.push({ [key]: value });
      }
    });
    return errors;
  }

  public toString(): string {
    return this.toJSON().reduce((acc, curr) => {
      if (isString(curr)) {
        return `${acc} | ${curr}`;
      }
      const [key] = Object.keys(curr);
      const value = curr[key].join(', ');
      return `${acc} ${key}: ${value}\n`;
    }, '') as string;
  }
}
