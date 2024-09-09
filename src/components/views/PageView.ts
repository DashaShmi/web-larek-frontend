import { IAppEventScheme, IPageData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ViewWithEvents } from "../base/ViewWithEvents"

export class PageView extends ViewWithEvents<IPageData, IAppEventScheme> {

  protected button: HTMLButtonElement;
  protected counter: HTMLElement;

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);

    this.button = ensureElement<HTMLButtonElement>('.header__basket');
    this.counter = ensureElement<HTMLElement>('.header__basket-counter');

    this.button.addEventListener('click', () => {
      this.events.emit('cart:open');
    })
  };

  override render(data: IPageData): HTMLElement {
    this.counter.innerText = `${data.count}`;
    return this.element
  }
}