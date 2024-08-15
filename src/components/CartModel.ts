import { ICartModel, IProductData } from "../types/contracts";

export class CartModel implements ICartModel {
  products: IProductData[] = [];

  add(data: IProductData): void {
    // Проверка на наличие продукта в корзине

    const existingProduct = this.products.find(product => product.id === data.id);

    if (existingProduct !== undefined && existingProduct !== null) {
      return;
    }

    this.products.push(data);
  }

  delete(productId: string): void {

    const existingProduct = this.products.findIndex(product => product.id === productId);
    // Если сплайс не найдет такой элемент в массиве он вернет -1
    if (existingProduct < 0) {
      return;
    }
    // Удаляем элемент массива
    this.products.splice(existingProduct, 1);
  }

  counter: number = 0;
}

