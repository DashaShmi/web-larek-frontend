import { ICartData } from "../../types/contracts";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CartItemView } from "./CartItemView";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class CartView extends ViewWithEvents<ICartData> {
  private readonly listUl: HTMLElement;
  private readonly cartCount: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.listUl = ensureElement<HTMLElement>(".basket__list", this.element);
    this.cartCount = ensureElement<HTMLButtonElement>(".basket__price", this.element);

    const cartOrderButtom = ensureElement<HTMLButtonElement>('.basket__button', this.element);
    cartOrderButtom.addEventListener('click', () => this.events.emit('cart:completed', []));
  }

  override render(data: ICartData): HTMLElement {
    const liArray: HTMLElement[] = [];

    for (let i = 0; i < data.products.length; i++) {
      const productData = data.products[i];

      const cartItemView = new CartItemView(cloneTemplate('#card-basket'), this.events);
      const cartItemElement = cartItemView.render({
        title: productData.title,
        price: productData.price,
        index: `${i + 1}`,
        id: productData.id
      })

      liArray.push(cartItemElement);
    }
    this.cartCount.textContent = `${data.total} синапсов`;

    this.listUl.replaceChildren(...liArray);

    return this.element;
  }

}
