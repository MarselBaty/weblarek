import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IBasketViewData } from '../../types/index';

export class Basket extends Component<IBasketViewData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.listElement.replaceChildren(...items);
        } else {
            this.listElement.replaceChildren(
                this.createElement('p', { textContent: 'Корзина пуста' })
            );
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

    private createElement(tagName: string, props: Record<string, any>): HTMLElement {
        const element = document.createElement(tagName);
        Object.assign(element, props);
        return element;
    }
}