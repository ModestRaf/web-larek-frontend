import {Api} from "./base/api";
import {IOrder, IOrderResult} from "../types";

export class LarekApi {
    private api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    async submitOrder(order: IOrder): Promise<IOrderResult> {
        try {
            console.log('Отправка заказа на сервер:', JSON.stringify(order, null, 2));
            const response = await this.api.post('/order', order) as IOrderResult;
            console.log('Ответ сервера:', JSON.stringify(response, null, 2));
            return response;
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}