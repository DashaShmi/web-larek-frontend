import { ensureElement } from "../../utils/utils";
import { ViewWithEvents } from "./ViewWithEvents";
import { IEvents } from "./events";

export abstract class ViewWithForm<T, TScheme> extends ViewWithEvents<T, TScheme> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;

  protected abstract onSubmit(): void;
  protected abstract onInputChange(name: string, value: string): void;

  constructor(element: HTMLElement, events: IEvents<TScheme>) {
    super(element, events);

    if (this.element instanceof HTMLFormElement && this.element.classList.contains('form')) {
      this.form = this.element;
    } else {
      this.form = ensureElement<HTMLFormElement>('.form', this.element);
    }

    this.submitButton = ensureElement<HTMLButtonElement>('.button', this.form);

    // слушаем инпуты
    this.form.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      this.onInputChange(target.name, value);
    })

    // слушаем сабмит
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.onSubmit();
    });
  }
}