import { IOrderData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ViewWithEvents } from "./ViewWithEvents";

export class SuccessfulOrderView extends ViewWithEvents<IOrderData> {
  private readonly totalElement: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.totalElement = ensureElement<HTMLElement>(".order-success__description", this.element);
  }

  render(data: IOrderData): HTMLElement {
    this.totalElement.textContent = `Списано ${data.total} синапсов`;
    return this.element;
  }
}