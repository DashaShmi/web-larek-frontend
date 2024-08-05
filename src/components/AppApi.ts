import { IApi, IProductData } from "../types/contracts";

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProducts(): Promise<IProductData[]> {
    return this._baseApi.get<IProductData[]>(`/product/`).then((cards: IProductData[]) => cards);
  }
}