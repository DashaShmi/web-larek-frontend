import { IPaymentInfoData } from "../types/contracts";
import { IFormDataWithErrors, FormErrors } from "./FormErrors";
import { ModelBase } from "./ModelBase";


export class PaymentInfoModel extends ModelBase {

  public data: IFormDataWithErrors<IPaymentInfoData> = {
    value: {
      paymentMethod: "",
      address: ""
    },
    errors: {}
  };


  setField(name: string, fieldValue: string): void {
    if (name === 'address') {
      this.data.value[name] = fieldValue;
    } else if (name === 'paymentMethod') {
      if (fieldValue !== 'offline' && fieldValue !== 'online' && fieldValue !== "") {
        console.error(`Не корректный способ оплаты: ${fieldValue}`);
        return;
      }

      this.data.value[name] = fieldValue;
    } else {
      console.error(`Неизвестное имя поля: ${name}`)
      return;
    }
    this.validateOrder()
  }

  validateOrder(): boolean {
    const errors: FormErrors<IPaymentInfoData> = {};

    if (this.data.value.address.length === 0) {
      errors.address = 'Необходимо указать адрес';
    }

    if (this.data.value.paymentMethod === "") {
      errors.paymentMethod = 'Необходимо указать способ оплаты';
    }




    this.data.errors = errors;
    this.events.emit('paymentsInfo:error-change', this.data);
    return Object.keys(errors).length === 0;
  }


}