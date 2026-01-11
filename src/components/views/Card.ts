import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct, ICardActions } from '../../types/index';

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        if (actions?.onClick) {
            if (this.container.tagName === 'BUTTON') {
                this.container.addEventListener('click', actions.onClick);
            } else {
                const button = this.container.querySelector('button');
                if (button) {
                    button.addEventListener('click', actions.onClick);
                }
            }
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}