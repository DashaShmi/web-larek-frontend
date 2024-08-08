import { IProductData } from "../types/contracts";
import { ensureElement } from "../utils/utils";
import { ProductView } from "./ProductView";


export class ProductDetailView extends ProductView {
  private readonly description: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.description = ensureElement<HTMLElement>(".card__text", this.element);
  }

  override render(data: IProductData): HTMLElement {
    super.render(data);
    this.description.textContent = data.description;
    return this.element;
  }
}
