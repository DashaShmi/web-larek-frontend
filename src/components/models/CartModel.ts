import { IAppEventScheme, ICartModel, IProductData } from "../../types/contracts";
import { IEvents } from "../base/events";
import { ModelBase } from "../base/ModelBase";

export class CartModel extends ModelBase<IAppEventScheme> implements ICartModel {
  private _products: IProductData[] = [];
  private _total = 0;

  public get products(): IProductData[] {
    return this._products;
  }

  public get total(): number {
    return this._total
  }

  public get isValid(): boolean {
    return this.total !== 0;
  }

  constructor(events: IEvents<IAppEventScheme>) {
    super(events);
  }

  contains(productId: string): boolean {
    const existingProduct = this.products.find(product => product.id === productId);
    return existingProduct !== undefined && existingProduct !== null;
  }

  add(data: IProductData): void {
    // Проверка на наличие продукта в корзине

    const existingProduct = this.products.find(product => product.id === data.id);

    if (existingProduct !== undefined && existingProduct == null) {
      return;
    }

    this._products.push(data);

    if (data.price == null) {
      // this.counter = 0;
    }
    else {
      this._total += data.price;
    }
    this.events.emit('cart:changed');
  }

  delete(productId: string): void {
    const existingProduct = this.products.find(product => product.id === productId);

    if (existingProduct === undefined || existingProduct === null) {
      return;
    }

    const existingProductIndex = this.products.indexOf(existingProduct);

    // Если сплайс не найдет такой элемент в массиве он вернет -1
    if (existingProductIndex < 0) {
      return;
    }

    if (existingProduct.price == null) {
      // this.counter = 0;
    }
    else {
      this._total = this.total - existingProduct.price;
    }
    // Удаляет элемент из массива
    this._products.splice(existingProductIndex, 1);
    this.events.emit('cart:changed');
  }

  reset(): void {
    this._products.splice(0, this._products.length);
    this._total = 0;
    this.events.emit('cart:changed');
  }
}

