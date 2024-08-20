import { IProductData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ProductViewBase } from "./ProductViewBase";

export class ProductDetailView extends ProductViewBase {
  private readonly description: HTMLElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.description = ensureElement<HTMLElement>(".card__text", this.element);
    const btnAddToCart = ensureElement<HTMLElement>(".card__button", this.element);
    btnAddToCart.addEventListener('click', () => this.events.emit<IProductData>('product:add_to_cart', this.data));
  }

  // перезапись
  override render(data: IProductData): HTMLElement {
    super.render(data);
    this.description.textContent = data.description;
    return this.element;
  }
}


