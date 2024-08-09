import { IModalData } from "../../types/contracts";
import { ensureElement } from "../../utils/utils";
import { View } from "./View";

export class ModalView extends View<IModalData> {

  constructor(element: HTMLElement) {
    super(element);
    const closeButtonElement = ensureElement('.modal__close', element);
    closeButtonElement.addEventListener("click", this.close.bind(this));
  }


  open(): void {
    this.element.classList.add('modal_active');
    document.addEventListener("keyup", this.handleEscUp);
  };

  close(): void {
    this.element.classList.remove('modal_active');
    document.removeEventListener("keyup", this.handleEscUp);
  };

  render(data: Partial<IModalData>) {

    this.element.querySelector('.modal__content')!.textContent = 'popa';

    return this.element;
  }

  handleEscUp = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      this.close();

      console.log('escape');
    }
  };
}
