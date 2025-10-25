import styles from './styles/historyBuy.module.css';

export default function HistoryCart({ order }) {
    if (!order) return null;

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Определение типа товара
    const getProductType = (items) => {
        if (!items || items.length === 0) return 'Товар';
        
        const firstItem = items[0];
        // Здесь можно добавить логику определения типа по данным товара
        return firstItem.type || 'Цифровой товар';
    };

    const orderDate = formatDate(order.createdAt || order.date);
    const productType = getProductType(order.items);

    return (
        <section className={styles.history_card_container}>
            <div className={styles.row_container}>
                <div className={styles.col_container}>
                    <div className={styles.titls}>
                        <p className={styles.title_history_card}>
                            {order.items && order.items.length > 0 
                                ? order.items.map(item => item.name || 'Товар').join(', ')
                                : 'Заказ без товаров'
                            }
                        </p>
                        <p className={styles.type_history_card}>{productType}</p>
                    </div>
                    <div className={styles.history_date}>{orderDate}</div>
                </div>
                <p className={styles.history_cost}>{order.totalPrice || order.totalAmount} ₸</p>
            </div>
        </section>
    );
}