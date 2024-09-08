import { IPaymentInfoData } from "../types/contracts";
import { IEvents } from "./base/events";
import { IFormDataWithErrors, FormErrors } from "./FormErrors";
import { ModelBase } from "./ModelBase";


export class PaymentInfoModel extends ModelBase {

  public data: IFormDataWithErrors<IPaymentInfoData> = {
    value: {
      paymentMethod: "",
      address: ""
    },
    errors: {},
    isValid: false
  }

  constructor(events: IEvents) {
    super(events);

    this.validateOrder();
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

  private validateOrder(): void {
    const errors: FormErrors<IPaymentInfoData> = {};

    if (this.data.value.address.length === 0) {
      errors.address = 'Необходимо указать адрес';
    }

    if (this.data.value.paymentMethod === "") {
      errors.paymentMethod = 'Необходимо указать способ оплаты';
    }

    this.data.errors = errors;
    this.events.emit('paymentsInfo:error-change', this.data);
    this.data.isValid = Object.keys(errors).length === 0;
  }


}