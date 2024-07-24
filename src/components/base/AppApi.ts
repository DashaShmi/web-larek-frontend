import { IApi, IProductData } from "../../types";

interface IProductListResponse {
  total: number;
  items: IProductData[];
}

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductList(): Promise<IProductListResponse> {
    throw new Error("не реализовано")
  }

  getProduct(id: string): Promise<IProductData> {
    throw new Error("не реализовано")
  }

  // дописать методы работы с апи
}

