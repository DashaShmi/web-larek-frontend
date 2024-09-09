import { IApi, IProductData, IAppApi, IApiOrderData } from "../types/contracts";
import { IListResponse, IOrderResponse } from "./base/api";

export class AppApi implements IAppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  sendOrder(data: IApiOrderData): Promise<IOrderResponse> {
    return this._baseApi.post<IOrderResponse>(`/order`, data);
  }

  getProductList(): Promise<IListResponse<IProductData>> {
    return this._baseApi.get<IListResponse<IProductData>>(`/product/`);
  }

  getProduct(id: string): Promise<IProductData> {
    return this._baseApi.get<IProductData>(`/product/${id}`);
  }
}