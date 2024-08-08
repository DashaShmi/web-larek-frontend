
export abstract class View<T> {
  protected readonly element: HTMLElement;

  abstract render(data: T): HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }
}

