import { IApi } from "../../types/contracts";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api implements IApi {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok)
            return response.json();

        else return response.json()
            .then(data => Promise.reject(data.error ?? response.statusText));
    }

    async get<T>(uri: string) {
        const requestParam = {
            ...this.options,
            method: 'GET'
        }

        const response = await fetch(this.baseUrl + uri, requestParam);
        const data = await this.handleResponse<T>(response);

        return data;
    }

    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        const requestParam = {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }
        const responsePromis = fetch(this.baseUrl + uri, requestParam);

        const dataPromise = responsePromis.then(this.handleResponse<T>);
        return dataPromise
    }
}
