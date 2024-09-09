import { IAppEventScheme, IPaymentInfoData } from "../../types/contracts";
import { IEvents } from "../base/events";
import { FormModel } from "../base/FormModel";
import { FormErrors } from "../../types/contracts";

export class PaymentInfoModel extends FormModel<IPaymentInfoData, IAppEventScheme> {

  constructor(events: IEvents<IAppEventScheme>) {
    super(events, {
      paymentMethod: "",
      address: ""
    });
  }

  setField(name: string, fieldValue: string): void {
    if (name === 'address') {
      this.setAddress(fieldValue);
    } else if (name === 'paymentMethod') {
      this.setPaymentMethod(fieldValue)
    } else {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.validateOrder();
  }

  private setAddress(fieldValue: string): void {
    this.data.value.address = fieldValue;
  }

  private setPaymentMethod(fieldValue: string): void {
    if (fieldValue !== 'offline' && fieldValue !== 'online' && fieldValue !== "") {
      console.error(`Не корректный способ оплаты: ${fieldValue}`);
      return;
    }
    this.data.value.paymentMethod = fieldValue;
  }

  protected validateOrder(): void {
    const errors: FormErrors<IPaymentInfoData> = {};

    if (this.data.value.address.length === 0) {
      errors.address = 'Необходимо указать адрес';
    }

    if (this.data.value.paymentMethod === "") {
      errors.paymentMethod = 'Необходимо указать способ оплаты';
    }

    this._data.errors = errors;
    this._data.isValid = Object.keys(errors).length === 0;
    this.events.emit('paymentsInfo:error-change', this.data);
  }
}