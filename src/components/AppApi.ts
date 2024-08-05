import { IApi, IProductData, IAppApi } from "../types/contracts";
import { IListResponse } from "./base/api";

export class AppApi implements IAppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductList(): Promise<IListResponse<IProductData>> {
    return this._baseApi.get<IListResponse<IProductData>>(`/product/`).then((cards: IListResponse<IProductData>) => cards);
  }

  getProduct(id: string): Promise<IProductData> {
    throw new Error("Method not implemented.");
  }
}