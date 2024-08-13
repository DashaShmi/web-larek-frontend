import { IBasketData } from "../types/contracts";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { View } from "./base/View";

export class BasketView extends View<IBasketData> {
  private readonly listUl: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.listUl = ensureElement<HTMLElement>(".basket__list", this.element);
  }

  override render(data: IBasketData): HTMLElement {


    for (let i = 0; i < data.products.length; i++) {
      const productData = data.products[i];

      const li = cloneTemplate('#card-basket');
      // заполнение данными

      const cardTitle = ensureElement<HTMLElement>(".card__title", li);
      const cardPrice = ensureElement<HTMLElement>(".card__price", li);

      cardTitle.textContent = productData.title;
      cardPrice.textContent = productData.price == null ? 'Бесценно' : `${productData.price} синапсов`;

      this.listUl.appendChild(li);
    }
    return this.element;
  }

}
