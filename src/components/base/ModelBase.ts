import { IEvents } from "./events";


export class ModelBase {
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }
}
