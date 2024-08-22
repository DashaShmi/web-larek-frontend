import { ICartData, IDeleteProductData } from "../types/contracts";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ViewWithEvents } from "./ViewWithEvents";

export class CartView extends ViewWithEvents<ICartData> {
  private readonly listUl: HTMLElement;
  private readonly cartCount: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.listUl = ensureElement<HTMLElement>(".basket__list", this.element);
    this.cartCount = ensureElement<HTMLButtonElement>(".basket__price", this.element);
  }

  override render(data: ICartData): HTMLElement {

    const liArray: HTMLElement[] = [];

    for (let i = 0; i < data.products.length; i++) {
      const productData = data.products[i];

      const li = cloneTemplate('#card-basket');

      // заполнение данными

      const cardTitle = ensureElement<HTMLElement>(".card__title", li);
      const cardPrice = ensureElement<HTMLElement>(".card__price", li);
      const cartIndex = ensureElement<HTMLElement>(".basket__item-index", li);
      const cartDelineButton = ensureElement<HTMLButtonElement>(".basket__item-delete", li);


      cardTitle.textContent = productData.title;
      cardPrice.textContent = productData.price == null ? 'Бесценно' : `${productData.price} синапсов`;
      cartIndex.textContent = `${i + 1}`;
      cartDelineButton.addEventListener('click', () => this.events.emit<IDeleteProductData>('cart:item-deleted', { id: productData.id }));
      liArray.push(li);
    }
    this.cartCount.textContent = `${data.counter}`;

    this.listUl.replaceChildren(...liArray);

    return this.element;
  }

}
