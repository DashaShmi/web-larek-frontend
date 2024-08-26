import { IProductData, ICatalogModel } from "../types/contracts";
import { IEvents } from "./base/events";
import { ModelBase } from "./ModelBase";

export class CatalogModel extends ModelBase implements ICatalogModel {
  products: IProductData[] = [];

  constructor(events: IEvents) {
    super(events);
  }

  setProducts(newProducts: IProductData[]): void {
    this.products = newProducts;
    this.events.emit<IProductData[]>('catalog:changed', this.products);
  }
}