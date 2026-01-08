import { IBuyer, TPayment, IValidationErrors } from '../../types/index';

export class Buyer {
    private payment: TPayment | null = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setEmail(email: string): void {
        this.email = email;
    }

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
    }

    validateOrderForm(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        return errors;
    }

    validateContactsForm(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        return errors;
    }

    isOrderFormValid(): boolean {
        return Object.keys(this.validateOrderForm()).length === 0;
    }

    isContactsFormValid(): boolean {
        return Object.keys(this.validateContactsForm()).length === 0;
    }
}