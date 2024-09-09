import { IAppEventScheme, ICatalogData, IProductData } from "../../types/contracts";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ProductView } from "./ProductView";
import { ViewWithEvents } from "../base/ViewWithEvents";

export class CatalogView extends ViewWithEvents<ICatalogData, IAppEventScheme> {

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);
  }

  override render(data: ICatalogData): HTMLElement {
    this.element.replaceChildren(...data.elements);
    return this.element;
  }
}