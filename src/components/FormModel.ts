import { IEvents } from "./base/events";
import { IFormDataWithErrors } from "./FormErrors";
import { ModelBase } from "./ModelBase";


export abstract class FormModel<TData> extends ModelBase {
  public data: IFormDataWithErrors<TData>;

  private readonly defaultValue: TData;

  public abstract setField(name: string, fieldValue: string): void;
  protected abstract validateOrder(): void;

  constructor(events: IEvents, defaultValue: TData) {
    super(events);
    this.defaultValue = defaultValue;

    this.data = {
      value: defaultValue,
      errors: {},
      isValid: false,
    };
    this.reset();
  }

  reset(): void {
    this.data = {
      value: this.defaultValue,
      errors: {},
      isValid: false
    };

    this.validateOrder();
  }
}
