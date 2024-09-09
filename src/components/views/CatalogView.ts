import { IAppEventScheme, ICatalogData } from "../../types/contracts";
import { IEvents } from "../base/events";
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