import { IProductData } from "../types/contracts";
import { View } from "./base/View";

export class ProductView extends View<IProductData> {
  render(data: IProductData): HTMLElement {
    this.element.style.backgroundColor = '#0000ff';
    this.element.style.whiteSpace = 'pre-wrap';
    this.element.innerText = JSON.stringify(data, undefined, 4);
    return this.element;
  }
}
