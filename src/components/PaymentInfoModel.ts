import { IPaymentInfoData } from "../types/contracts";
import { IFormDataWithErrors, FormErrors } from "./FormErrors";
import { ModelBase } from "./ModelBase";


export class PaymentInfoModel extends ModelBase {

  public data: IFormDataWithErrors<IPaymentInfoData> = {
    value: {
      paymentMethod: "online",
      address: ""
    },
    errors: {}
  };


  setField(name: string, value: string): void {

    if (name !== 'address') {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.data.value[name] = value;
    this.validateOrder()
  }

  validateOrder(): boolean {
    const errors: FormErrors<IPaymentInfoData> = {};

    if (this.data.value.address.length === 0) {
      errors.address = 'Необходимо указать адрес';
    }

    if (this.data.value.paymentMethod === 'offline' || this.data.value.paymentMethod === 'online') {
    } else {
      errors.paymentMethod = 'Необходимо выбрать способ оплаты';
    }

    this.data.errors = errors;
    this.events.emit('paymentsInfo:error-change', this.data);
    return Object.keys(errors).length === 0;
  }


}