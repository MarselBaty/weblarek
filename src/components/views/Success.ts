import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
    }

    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
}