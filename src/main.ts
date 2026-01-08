import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { WebLarekAPI } from './components/WebLarekAPI';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

// Создание экземпляров классов-моделей данных
const productCatalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();

console.log('=== Тестирование моделей данных ===');

// Тестирование ProductCatalog
console.log('\n--- Тестирование ProductCatalog ---');
productCatalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productCatalog.getProducts());

const firstProduct = productCatalog.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар по ID:', firstProduct);

productCatalog.setSelectedProduct(firstProduct!);
console.log('Выбранный товар:', productCatalog.getSelectedProduct());

// Тестирование Basket
console.log('\n--- Тестирование Basket ---');
console.log('Пустая корзина:', basket.getItems());
console.log('Количество товаров в пустой корзине:', basket.getItemsCount());
console.log('Общая стоимость пустой корзины:', basket.getTotalPrice());

// Добавляем товары в корзину
const products = productCatalog.getProducts();
basket.addItem(products[0]); // +1 час в сутках - 750
basket.addItem(products[1]); // HEX-леденец - 1450
basket.addItem(products[3]); // Фреймворк куки судьбы - 2500

console.log('Корзина после добавления товаров:', basket.getItems());
console.log('Количество товаров в корзине:', basket.getItemsCount());
console.log('Общая стоимость корзины:', basket.getTotalPrice());

console.log('Есть ли товар с ID 854cef69-976d-4c2a-a18c-2aa45046c390:', basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Удаляем товар из корзины
basket.removeItem(products[0]);
console.log('Корзина после удаления первого товара:', basket.getItems());
console.log('Количество товаров после удаления:', basket.getItemsCount());
console.log('Общая стоимость после удаления:', basket.getTotalPrice());

// Тестирование Buyer
console.log('\n--- Тестирование Buyer ---');
console.log('Пустые данные покупателя:', buyer.getBuyerData());

// Проверяем валидацию пустых данных
console.log('Ошибки валидации (пустые данные):', buyer.validateBuyerData());
console.log('Данные покупателя валидны (пустые):', buyer.isBuyerDataValid());

// Заполняем данные покупателя через универсальный метод
buyer.setBuyerData({
    payment: 'card',
    address: 'Москва, ул. Тверская, д. 1',
    email: 'test@example.com',
    phone: '+7 (999) 123-45-67'
});

console.log('Заполненные данные покупателя:', buyer.getBuyerData());
console.log('Ошибки валидации (заполненные данные):', buyer.validateBuyerData());
console.log('Данные покупателя валидны (заполненные):', buyer.isBuyerDataValid());

// Тестируем частичное обновление данных
buyer.setBuyerData({ address: 'Санкт-Петербург, Невский проспект, д. 10' });
console.log('Данные после частичного обновления:', buyer.getBuyerData());

// Тестируем валидацию частично заполненных данных
buyer.clearBuyerData();
buyer.setBuyerData({ payment: 'cash', address: 'Москва' });
console.log('Частично заполненные данные:', buyer.getBuyerData());
console.log('Ошибки валидации (частично заполненные):', buyer.validateBuyerData());
console.log('Данные валидны (частично заполненные):', buyer.isBuyerDataValid());

// Очищаем данные
buyer.clearBuyerData();
console.log('Данные после очистки:', buyer.getBuyerData());

// Очищаем корзину
basket.clear();
console.log('Корзина после очистки:', basket.getItems());
console.log('Количество товаров после очистки корзины:', basket.getItemsCount());

console.log('\n=== Тестирование завершено ===');

// Тестирование работы с сервером
console.log('\n=== Тестирование работы с сервером ===');

// Создаем экземпляр API и WebLarekAPI
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);

// Получаем товары с сервера
webLarekAPI.getProducts()
    .then(serverProducts => {
        console.log('Товары получены с сервера:', serverProducts);
        
        // Сохраняем товары в модель данных
        productCatalog.setProducts(serverProducts);
        console.log('Товары сохранены в каталог:', productCatalog.getProducts());
        
        console.log('Количество товаров с сервера:', serverProducts.length);
        console.log('Первый товар с сервера:', serverProducts[0]);
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
