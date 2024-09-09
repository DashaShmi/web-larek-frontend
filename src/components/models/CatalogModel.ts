import { IProductData, ICatalogModel, IAppEventScheme } from "../../types/contracts";
import { IEvents } from "../base/events";
import { ModelBase } from "../base/ModelBase";

export class CatalogModel extends ModelBase<IAppEventScheme> implements ICatalogModel {
  private _products: IProductData[] = [];

  constructor(events: IEvents<IAppEventScheme>) {
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