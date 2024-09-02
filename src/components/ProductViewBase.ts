import { IProductData, IProductViewData } from "../types/contracts";
import { CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ViewWithEvents } from "./ViewWithEvents";

export class ProductViewBase<T extends IProductData> extends ViewWithEvents<T> {
  private readonly title: HTMLHeadingElement;
  private readonly image: HTMLImageElement;
  private readonly price: HTMLElement;
  private readonly category: HTMLElement;
  protected data?: T;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);
    this.title = ensureElement<HTMLHeadingElement>(".card__title", this.element);
    this.image = ensureElement<HTMLImageElement>(".card__image", this.element);
    this.price = ensureElement<HTMLElement>(".card__price", this.element);
    this.category = ensureElement<HTMLElement>(".card__category", this.element);
  }

  render(data: T): HTMLElement {
    this.title.textContent = data.title;
    this.image.src = `${CDN_URL}${data.image}`;
    this.price.textContent = data.price !== null ? `${data.price} синапсов` : 'Бесценно';
    this.category.textContent = data.category;
    this.data = data;

    const map: Record<string, string> = {
      "софт-скил": 'card__category_soft',
      "хард-скил": 'card__category_hard',
      "другое": 'card__category_other',
      "кнопка": 'card__category_button',
      "дополнительное": 'card__category_additional'
    }

    const allClasses = Object.values(map);
    this.category.classList.remove(...allClasses);
    const categoryClass = map[data.category];
    this.category.classList.add(categoryClass);
    return this.element;
  }
}
