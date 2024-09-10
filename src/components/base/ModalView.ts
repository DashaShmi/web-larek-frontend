import { IAppEventScheme, IModalData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "./events";
import { ViewWithEvents } from "./ViewWithEvents";

export class ModalView extends ViewWithEvents<IModalData, IAppEventScheme> {

  private readonly modalContent: HTMLElement;

  constructor(element: HTMLElement, events: IEvents<IAppEventScheme>) {
    super(element, events);
    const closeButtonElement = ensureElement('.modal__close', element);
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.element);
  }

  open(): void {
    this.element.classList.add('modal_active');
    document.addEventListener("keyup", this.handleEscUp);
    this.events.emit('modal:open')

  }

  close(): void {
    this.element.classList.remove('modal_active');
    document.removeEventListener("keyup", this.handleEscUp);
    this.events.emit('modal:close');
  }

  render(data: IModalData) {
    this.modalContent.replaceChildren(data.content);
    return this.element;
  }

  handleEscUp = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      this.close();

      console.log('escape');
    }
  };
}

