import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types/index';

interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardButton.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        });

        this.cashButton.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        });
    }

    set payment(value: TPayment) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}