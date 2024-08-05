import { IProductData } from "../types/contracts";
import { View } from "./base/View";

export class ProductView extends View<IProductData> {
  constructor(element: HTMLElement) {
    super(element);

    // ...
  }

  render(data: IProductData): HTMLElement {
    this.element.style.backgroundColor = '#0000ff';
    return this.element;
  }
}
