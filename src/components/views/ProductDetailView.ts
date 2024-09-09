import { IIdData, IProductData, IProductDetailViewData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ProductViewBase } from "./ProductViewBase";

export class ProductDetailView extends ProductViewBase<IProductDetailViewData> {
  private readonly description: HTMLElement;
  private readonly btnAddToCart = ensureElement<HTMLElement>(".card__button", this.element);

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.description = ensureElement<HTMLElement>(".card__text", this.element);

    this.btnAddToCart.addEventListener('click', () => {

      if (this.data == undefined) {
        return
      }

      if (this.data.inCart) {
        this.events.emit('product:remove_from_cart', { id: this.data.id });
      }
      else {
        this.events.emit('product:add_to_cart', this.data);
      }
    });
  }

  // перезапись
  override render(data: IProductDetailViewData): HTMLElement {
    super.render(data);
    this.description.textContent = data.description;
    this.btnAddToCart.innerText = data.inCart ? `Удалить из корзины` : `В корзину`;
    return this.element;
  }
}


