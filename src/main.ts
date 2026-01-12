import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket as BasketView } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct } from './types/index';

// Создание брокера событий
const events = new EventEmitter();

// Создание экземпляров моделей данных
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const productCatalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

// Получение шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создание компонентов представления
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание форм
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Презентер - обработчики событий

// Изменение каталога товаров
events.on('catalog:changed', () => {
    const itemCards = productCatalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            category: item.category,
            price: item.price
        });
    });
    page.catalog = itemCards;
});

// Выбор карточки для просмотра
events.on('card:select', (item: IProduct) => {
    productCatalog.setSelectedProduct(item);
});

// Изменение выбранного товара
events.on('product:selected', () => {
    const item = productCatalog.getSelectedProduct();
    if (item) {
        const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                if (basket.hasItem(item.id)) {
                    events.emit('card:remove', item);
                } else {
                    events.emit('card:add', item);
                }
            }
        });
        
        modal.render({
            content: card.render({
                title: item.title,
                image: CDN_URL + item.image,
                category: item.category,
                description: item.description,
                price: item.price,
                buttonText: basket.hasItem(item.id) ? 'Удалить из корзины' : 'В корзину',
                buttonDisabled: item.price === null
            })
        });
    }
});

// Добавление товара в корзину
events.on('card:add', (item: IProduct) => {
    basket.addItem(item);
    modal.close();
});

// Удаление товара из корзины
events.on('card:remove', (item: IProduct) => {
    basket.removeItem(item);
    modal.close();
});

// Изменение корзины
events.on('basket:changed', () => {
    page.counter = basket.getItemsCount();
    
    // Если корзина открыта в модальном окне, обновляем её содержимое
    if (modal.content.querySelector('.basket')) {
        const basketView = new BasketView(cloneTemplate(basketTemplate), events);
        const items = basket.getItems().map((item, index) => {
            const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
                onClick: () => events.emit('card:remove', item)
            });
            return card.render({
                title: item.title,
                price: item.price,
                index: index + 1
            });
        });
        
        modal.content = basketView.render({
            items,
            total: basket.getTotalPrice(),
            buttonDisabled: basket.getItemsCount() === 0
        });
    }
});

// Изменение данных покупателя
events.on('buyer:changed', () => {
    const errors = buyer.validateBuyerData();
    
    // Валидация формы заказа (payment и address)
    const orderErrors = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    
    const isOrderValid = !errors.payment && !errors.address;
    
    // Обновляем форму заказа только через сеттеры
    orderForm.valid = isOrderValid;
    orderForm.errors = orderErrors.join('; ');
    
    // Валидация формы контактов (email и phone)
    const contactErrors = [];
    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);
    
    const isContactValid = !errors.email && !errors.phone;
    
    // Обновляем форму контактов только через сеттеры
    contactsForm.valid = isContactValid;
    contactsForm.errors = contactErrors.join('; ');
});

// Открытие корзины
events.on('basket:open', () => {
    const basketView = new BasketView(cloneTemplate(basketTemplate), events);
    const items = basket.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    
    modal.render({
        content: basketView.render({
            items,
            total: basket.getTotalPrice(),
            buttonDisabled: basket.getItemsCount() === 0
        })
    });
});

// Открытие формы заказа
events.on('order:open', () => {
    const buyerData = buyer.getBuyerData();
    
    modal.render({
        content: orderForm.render({
            payment: buyerData.payment,
            address: buyerData.address
        })
    });
    
    // Устанавливаем состояние формы ПОСЛЕ рендеринга в DOM
    const errors = buyer.validateBuyerData();
    const orderErrors = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    
    const isOrderValid = !errors.payment && !errors.address;
    
    orderForm.valid = isOrderValid;
    orderForm.errors = orderErrors.join('; ');
});

// Изменение формы заказа
events.on('order:change', (data: { field: keyof typeof buyer, value: string }) => {
    buyer.setBuyerData({ [data.field]: data.value });
});

// Отправка формы заказа
events.on('order:submit', () => {
    const buyerData = buyer.getBuyerData();
    
    modal.render({
        content: contactsForm.render({
            email: buyerData.email,
            phone: buyerData.phone
        })
    });
    
    // Устанавливаем состояние формы ПОСЛЕ рендеринга в DOM
    const errors = buyer.validateBuyerData();
    const contactErrors = [];
    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);
    
    const isContactValid = !errors.email && !errors.phone;
    
    contactsForm.valid = isContactValid;
    contactsForm.errors = contactErrors.join('; ');
});

// Изменение формы контактов
events.on('contacts:change', (data: { field: keyof typeof buyer, value: string }) => {
    buyer.setBuyerData({ [data.field]: data.value });
});

// Отправка формы контактов
events.on('contacts:submit', () => {
    const orderData = {
        ...buyer.getBuyerData(),
        total: basket.getTotalPrice(),
        items: basket.getItems().filter(item => item.price !== null).map(item => item.id)
    };
    
    webLarekAPI.createOrder(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), events);
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
            basket.clear();
            buyer.clearBuyerData();
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
    page.locked = false;
});

// Закрытие окна успешного заказа
events.on('success:close', () => {
    modal.close();
});

// Получение товаров с сервера
webLarekAPI.getProducts()
    .then(serverProducts => {
        productCatalog.setProducts(serverProducts);
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });