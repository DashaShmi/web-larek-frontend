import { IEvents } from "./events";
import { View } from "./View";

export abstract class ViewWithEvents<T, TEventScheme> extends View<T> {
  protected events: IEvents<TEventScheme>;

  constructor(element: HTMLElement, events: IEvents<TEventScheme>) {
    super(element);
    this.events = events;
  };
}
