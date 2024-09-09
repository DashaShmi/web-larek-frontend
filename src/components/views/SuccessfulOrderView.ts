import { ISuccessfulOrderData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class SuccessfulOrderView extends ViewWithEvents<ISuccessfulOrderData> {
  private readonly totalElement: HTMLElement;
  private readonly buttonNewShop: HTMLButtonElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.totalElement = ensureElement<HTMLElement>(".order-success__description", this.element);
    this.buttonNewShop = ensureElement<HTMLButtonElement>(".order-success__close", this.element);

    this.buttonNewShop.addEventListener('click', () => {
      this.events.emit('order:close')
    })
  }

  render(data: ISuccessfulOrderData): HTMLElement {
    this.totalElement.textContent = `Списано ${data.total} синапсов`;
    return this.element;
  }
}