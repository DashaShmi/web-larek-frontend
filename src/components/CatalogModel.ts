import { IProductData, ICatalogModel } from "../types/contracts";
import { IEvents } from "./base/events";
import { ModelBase } from "./ModelBase";

export class CatalogModel extends ModelBase implements ICatalogModel {
  private _products: IProductData[] = [];

  constructor(events: IEvents) {
    super(events);
  }

  get products(): IProductData[] {
    return this._products;
  }

  set products(newProducts: IProductData[]) {
    this._products = newProducts;
    this.events.emit('catalog:changed', this._products);
  }
}