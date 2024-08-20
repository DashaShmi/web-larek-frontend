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

  constructor(events: IEvents) {
    super(events);
  }

  add(data: IProductData): void {
    // Проверка на наличие продукта в корзине

    const existingProduct = this.products.find(product => product.id === data.id);

    if (existingProduct !== undefined && existingProduct !== null) {
      return;
    }

    this.products.push(data);
    this.events.emit<IProductData[]>('cards:changed', this.products);
  }

  delete(productId: string): void {
    const existingProductIndex = this.products.findIndex(product => product.id === productId);

    // Если сплайс не найдет такой элемент в массиве он вернет -1
    if (existingProductIndex < 0) {
      return;
    }
    // Удаляем элемент массива
    this.products.splice(existingProductIndex, 1);
    this.events.emit<IProductData[]>('cards:changed', this.products);
  }

  counter: number = 0;
}

