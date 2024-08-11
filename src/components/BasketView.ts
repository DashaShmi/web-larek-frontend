import { IBasketData } from "../types/contracts";
import { View } from "./base/View";

export class BasketView extends View<IBasketData> {
  override render(data: IBasketData): HTMLElement {

    return this.element;
  }

}
