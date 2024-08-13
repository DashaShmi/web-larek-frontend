import { IEvents } from "./base/events";
import { ProductViewBase } from "./productViewBase";

export class ProductView extends ProductViewBase {

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this.element.addEventListener('click', () => this.events.emit('product:open', this.data))
  }
}

