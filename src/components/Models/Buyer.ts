import { IBuyer, TPayment, IValidationErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(protected events: IEvents) {}

    setBuyerData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        this.events.emit('buyer:changed');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment!,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    clearBuyerData(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
        this.events.emit('buyer:changed');
    }

    validateBuyerData(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        return errors;
    }

    isBuyerDataValid(): boolean {
        return Object.keys(this.validateBuyerData()).length === 0;
    }
}