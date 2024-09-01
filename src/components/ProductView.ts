import { IProductData } from "../types/contracts";
import { IEvents } from "./base/events";
import { ProductViewBase } from "./ProductViewBase";

export class ProductView extends ProductViewBase {

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.element.addEventListener('click', () => {
      if (this.data !== undefined) {
        this.events.emit('product:open', this.data)
      }
    })
  }
}
