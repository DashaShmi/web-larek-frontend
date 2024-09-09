import { IEvents } from "./events";

export class ModelBase<TScheme> {
  protected events: IEvents<TScheme>;

  constructor(events: IEvents<TScheme>) {
    this.events = events;
  }
}
