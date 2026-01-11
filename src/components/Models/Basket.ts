import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.hasItem(product.id)) {
            this.items.push(product);
            this.events.emit('basket:changed');
        }
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}