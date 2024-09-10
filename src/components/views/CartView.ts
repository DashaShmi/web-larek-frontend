import { IAppEventScheme, ICartData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class CartView extends ViewWithEvents<ICartData, IAppEventScheme> {
  private readonly listUl: HTMLElement;
  private readonly cartCount: HTMLElement;

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);
    this.listUl = ensureElement<HTMLElement>(".basket__list", this.element);
    this.cartCount = ensureElement<HTMLButtonElement>(".basket__price", this.element);

    const cartOrderButtom = ensureElement<HTMLButtonElement>('.basket__button', this.element);
    cartOrderButtom.addEventListener('click', () => this.events.emit('cart:completed'));
  }

  override render(data: ICartData): HTMLElement {
    this.cartCount.textContent = `${data.total} синапсов`;

    this.listUl.replaceChildren(...data.elements);

    return this.element;
  }

}
