import { ICartItemData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

import { ViewWithEvents } from "../base/ViewWithEvents";

export class CartItemView extends ViewWithEvents<ICartItemData> {
  private readonly cardTitle: HTMLElement;
  private readonly cardPrice: HTMLElement;
  private readonly cartIndex: HTMLElement;
  private readonly cartDeleteButton: HTMLButtonElement;
  protected data?: ICartItemData;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    // заполнение данными
    this.cardTitle = ensureElement<HTMLElement>(".card__title", element);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", element);
    this.cartIndex = ensureElement<HTMLElement>(".basket__item-index", element);
    this.cartDeleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", element);

    this.cartDeleteButton.addEventListener('click', () => {
      if (this.data !== undefined) {
        this.events.emit('cart:item-deleted', { id: this.data.id })
      } else {
        console.warn('data пустая! так быть не должно');
      }
    })
  }

  override render(data: ICartItemData): HTMLElement {
    this.cardTitle.textContent = data.title;
    this.cardPrice.textContent = data.price == null ? 'Бесценно' : `${data.price} синапсов`;
    this.cartIndex.textContent = data.index;
    this.data = data;
    return this.element
  }

}