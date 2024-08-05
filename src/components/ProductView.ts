import { IProductData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { View } from "./base/View";

export class ProductView extends View<IProductData> {

  private readonly title: HTMLHeadingElement;
  private readonly image: HTMLImageElement;
  private readonly price: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.title = ensureElement<HTMLHeadingElement>(".card__title", this.element);
    this.image = ensureElement<HTMLImageElement>(".card__image", this.element);
    this.price = ensureElement<HTMLElement>(".card__price", this.element);
  }

  render(data: IProductData): HTMLElement {
    this.title.textContent = data.title;
    this.image.src = `${data.image}`;
    this.price.textContent = `${data.price}`;
    return this.element;
  }
}
