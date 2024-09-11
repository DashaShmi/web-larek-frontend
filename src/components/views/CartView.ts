import { IAppEventScheme, ICartData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class CartView extends ViewWithEvents<ICartData, IAppEventScheme> {
  private readonly listUl: HTMLElement;
  private readonly cartCount: HTMLElement;
  private readonly cartOrderButtom: HTMLButtonElement;

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);
    this.listUl = ensureElement<HTMLElement>(".basket__list", this.element);
    this.cartCount = ensureElement<HTMLButtonElement>(".basket__price", this.element);

    this.cartOrderButtom = ensureElement<HTMLButtonElement>('.basket__button', this.element);
    this.cartOrderButtom.addEventListener('click', () => this.events.emit('cart:completed'));
  }

  override render(data: ICartData): HTMLElement {
    this.cartCount.textContent = `${data.total} синапсов`;
    this.listUl.replaceChildren(...data.elements);
    // кнопка вкл, если валиден заказ
    this.cartOrderButtom.disabled = !data.isValid;
    return this.element;
  }
}
