import { ensureElement } from "../utils/utils";
import { ViewWithEvents } from "./ViewWithEvents";
import { IEvents } from "./base/events";


export abstract class ViewWithForm<T> extends ViewWithEvents<T> {

  protected form: HTMLFormElement;
  protected formName: string;
  protected inputs: NodeListOf<HTMLInputElement>;
  // protected errors: Record<string, HTMLElement>;
  protected submitButton: HTMLButtonElement;

  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    if (this.element instanceof HTMLFormElement && this.element.classList.contains('form')) {
      this.form = this.element;
    } else {
      this.form = ensureElement<HTMLFormElement>('.form', this.element);
    }

    this.submitButton = ensureElement<HTMLButtonElement>('.button', this.form);
    this.submitButton.disabled = false;
    this.inputs = this.form.querySelectorAll<HTMLInputElement>('.form__input');
    this.formName = this.form.getAttribute('name') ?? 'noname';

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const formData = this.getInputValues()
      this.events.emit(`${this.formName}:submit` as any, formData);
      console.log(formData);
    });
  }

  protected getInputValues() {
    const valuesObject: Record<string, string> = {};
    this.inputs.forEach((element) => {
      valuesObject[element.name] = element.value;
    });
    return valuesObject;
  }


}