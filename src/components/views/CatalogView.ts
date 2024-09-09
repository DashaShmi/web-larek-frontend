import { IAppEventScheme, IProductData } from "../../types/contracts";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ProductView } from "./ProductView";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class CatalogView extends ViewWithEvents<IProductData[], IAppEventScheme> {

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);
  }

  override render(data: IProductData[]): HTMLElement {
    const array: HTMLElement[] = [];

    for (let i = 0; i < data.length; i++) {
      const productData = data[i];
      const productView = new ProductView(cloneTemplate('#card-catalog'), this.events);
      const productElement = productView.render(productData);
      array.push(productElement);
    }
    this.element.replaceChildren(...array);
    return this.element;

  }
}