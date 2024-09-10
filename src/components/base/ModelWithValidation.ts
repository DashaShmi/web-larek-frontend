import { IEvents } from "./events";
import { IDataWithErrors } from "../../types/contracts";
import { ModelBase } from "./ModelBase";

export abstract class ModelWithValidation<TData, TSceheme> extends ModelBase<TSceheme> {
  protected _data: IDataWithErrors<TData>;

  public get data(): Readonly<IDataWithErrors<TData>> {
    return this._data;
  }

  private readonly defaultValue: TData;

  public abstract setField(name: string, fieldValue: string): void;
  protected abstract validate(): void;

  constructor(events: IEvents<TSceheme>, defaultValue: TData) {
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

    this.validate();
  }
}
