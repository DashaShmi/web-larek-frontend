import { IAppEventScheme, IPageData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { ViewWithEvents } from "../base/ViewWithEvents"

export class PageView extends ViewWithEvents<Partial<IPageData>, IAppEventScheme> {

  protected cartButton: HTMLButtonElement;
  protected counter: HTMLElement;
  protected pageWrapper: HTMLElement;

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);

    this.cartButton = ensureElement<HTMLButtonElement>('.header__basket');
    this.counter = ensureElement<HTMLElement>('.header__basket-counter');
    this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper')

    this.cartButton.addEventListener('click', () => {
      this.events.emit('cart:open');
    })
  };

  override render(data: Partial<IPageData>): HTMLElement {
    if (data.count !== undefined) {
      this.counter.innerText = `${data.count}`;
    }

    if (data.isLocked === true) {
      this.pageWrapper.classList.add('page__wrapper_locked')
    }
    else if (data.isLocked === false) {
      this.pageWrapper.classList.remove('page__wrapper_locked')
    }
    return this.element
  }
}