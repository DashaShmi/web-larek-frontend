import { IProductData, IProductsModel } from "../types/contracts";
import { IEvents } from "./base/events";
import { ModelBase } from "./ModelBase";

class ProductsModel extends ModelBase implements IProductsModel {
  products: IProductData[] = [];

  constructor(events: IEvents) {
    super(events);
  }




}