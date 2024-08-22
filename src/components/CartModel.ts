import { ICartModel, IProductData } from "../types/contracts";
import { IEvents } from "./base/events";

export class ModalBase {
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }
}

export class CartModel extends ModalBase implements ICartModel {
  products: IProductData[] = [];
  counter: number = 0;

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
      this.counter += data.price;
    }
    this.events.emit<IProductData[]>('cart:changed', this.products);

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
    // Удаляем элемент массива

    if (existingProduct.price == null) {
      // this.counter = 0;
    }
    else {
      this.counter = this.counter - existingProduct.price;
    }

    this.products.splice(existingProductIndex, 1);
    this.events.emit<IProductData[]>('cart:changed', this.products);
  }
}

