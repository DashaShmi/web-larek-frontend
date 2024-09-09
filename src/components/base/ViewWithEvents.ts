import { IEvents } from "./events";
import { View } from "./View";

export abstract class ViewWithEvents<T> extends View<T> {
  protected events: IEvents;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;
  };
}
