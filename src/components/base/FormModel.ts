import { IEvents } from "./events";
import { IFormDataWithErrors } from "../FormErrors";
import { ModelBase } from "../ModelBase";


export abstract class FormModel<TData> extends ModelBase {
  private _data: IFormDataWithErrors<TData>;

  public get data(): Readonly<IFormDataWithErrors<TData>> {
    return this._data;
  }

  private readonly defaultValue: TData;

  public abstract setField(name: string, fieldValue: string): void;
  protected abstract validateOrder(): void;

  constructor(events: IEvents, defaultValue: TData) {
    super(events);
    this.defaultValue = defaultValue;

    this._data = {
      value: structuredClone(defaultValue),
      errors: {},
      isValid: false,
    };
    this.reset();
  }

  reset(): void {
    this._data = {
      value: structuredClone(this.defaultValue),
      errors: {},
      isValid: false
    };

    this.validateOrder();
  }
}
