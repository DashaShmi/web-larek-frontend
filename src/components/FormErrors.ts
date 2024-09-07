
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface IFormDataWithErrors<T> {
  value: T;
  errors: FormErrors<T>
}

