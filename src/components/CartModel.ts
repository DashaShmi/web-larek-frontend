import { ICartModel, IProductData } from "../types/contracts";
import { IEvents } from "./base/events";
import { ModelBase } from "./ModelBase";

export class CartModel extends ModelBase implements ICartModel {
  products: IProductData[] = [];
  total: number = 0;

  constructor(events: IEvents) {
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

    this.products.push(data);

    if (data.price == null) {
      // this.counter = 0;
    }
    else {
      this.total += data.price;
    }
    this.events.emit('cart:changed', this.products);

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
      this.total = this.total - existingProduct.price;
    }
    // Удаляет элемент из массива
    this.products.splice(existingProductIndex, 1);
    this.events.emit('cart:changed', this.products);
  }
}

