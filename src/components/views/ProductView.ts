import { IAppEventScheme, IProductData } from "../../types/contracts";
import { IEvents } from "../base/events";
import { ProductViewBase } from "./ProductViewBase";

export class ProductView extends ProductViewBase<IProductData> {

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);

    this.element.addEventListener('click', () => {
      if (this.data !== undefined) {
        this.events.emit('product:open', this.data)
      } else {
        console.warn('data пустая! так быть не должно');
      }
    })
  }
}
