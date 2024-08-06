import { IProductData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { View } from "./base/View";

export class ProductView extends View<IProductData> {

  private readonly title: HTMLHeadingElement;
  private readonly image: HTMLImageElement;
  private readonly price: HTMLElement;
  private readonly category: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.title = ensureElement<HTMLHeadingElement>(".card__title", this.element);
    this.image = ensureElement<HTMLImageElement>(".card__image", this.element);
    this.price = ensureElement<HTMLElement>(".card__price", this.element);
    this.category = ensureElement<HTMLElement>(".card__category", this.element);
  }

  render(data: IProductData): HTMLElement {
    this.title.textContent = data.title;
    this.image.src = `${data.image}`;
    this.price.textContent = data.price! == null ? `${data.price} синапсов` : 'Бесценно';
    this.category.textContent = data.category;

    this.category.classList.remove
      (
        'card__category_soft',
        'card__category_hard',
        'card__category_other',
        'card__category_button',
        'card__category_additional'
      );

    if (data.category == "софт-скил") {
      this.category.classList.add('card__category_soft')
    }
    else if (data.category == "хард-скил") {
      this.category.classList.add('card__category_hard')
    }
    else if (data.category == "другое") {
      this.category.classList.add('card__category_other')
    }
    else if (data.category == "кнопка") {
      this.category.classList.add('card__category_button')
    }
    else if (data.category == "дополнительное") {
      this.category.classList.add('card__category_additional')
    }
    return this.element;
  }
}
