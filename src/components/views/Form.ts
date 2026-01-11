import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IFormState } from '../../types/index';

export abstract class Form<T> extends Component<IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.getAttribute('name')}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    render(state: Partial<T> & IFormState): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}