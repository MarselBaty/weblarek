import { IApi, IProduct, IProductsResponse, IOrder, IOrderResult } from '../types/index';

export class WebLarekAPI {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<IProductsResponse>('/product/');
        return response.items;
    }

    async createOrder(order: IOrder): Promise<IOrderResult> {
        return await this.api.post<IOrderResult>('/order/', order);
    }
}