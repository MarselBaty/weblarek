import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { IProduct, ICardActions } from '../../types/index';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<IProduct> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey], 
                key === value
            );
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || '');
    }
}