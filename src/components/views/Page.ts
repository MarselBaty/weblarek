import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IPage } from '../../types/index';

export class Page extends Component<IPage> {
    protected gallery: HTMLElement;
    protected basketCounter: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.wrapper.classList.add('page__wrapper_locked');
        } else {
            this.wrapper.classList.remove('page__wrapper_locked');
        }
    }
}