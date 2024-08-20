import { IEvents } from "./base/events";
import { View } from "./base/View";

export abstract class ViewWithEvents<T> extends View<T> {
  protected events: IEvents;

  constructor(element: HTMLElement, events: IEvents) {
    super(element);
    this.events = events;
  };
}
