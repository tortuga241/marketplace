import styles from './styles/sellCart.module.css';

export default function SellCart({ order }) {
    if (!order) {
        return (
            <section className={styles.main_container_order_cart}>
                <p>Данные заказа не найдены</p>
            </section>
        );
    }

    // Функция для определения статуса заказа
    const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'оплачен':
            return { text: 'Оплачен', className: styles.status_paid };
        case 'in_progress':
        case 'в работе':
            return { text: 'В работе', className: styles.status_in_progress };
        case 'ready':
        case 'готов':
            return { text: 'Готов', className: styles.status_ready };
        case 'cancelled':
        case 'отменен':
            return { text: 'Отменен', className: styles.status_cancelled };
        default:
            return { text: status || 'Неизвестен', className: styles.status_unknown };
    }
};

    const statusInfo = getStatusInfo(order.status);
    
    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <section className={styles.main_container_order_cart}>
            <div className={styles.order_row_container}>
                <div className={styles.col_container}>
                    <p className={styles.order_code}>Заказ: #{order.code}</p>
                    <p className={styles.order_date}>{formatDate(order.createdAt || order.orderDate)}</p>
                </div>
                <div className={`${styles.status_order} ${statusInfo.className}`}>
                    {statusInfo.text}
                </div>
            </div>
            
            <div className={styles.order_row_container}>
                <div className={styles.order_info}>
                    <div className={styles.order_product}>
                        Товар: {order.product?.name || order.lot?.title || 'Название не указано'}
                    </div>
                    <div className={styles.order_buyer}>
                        Покупатель: {order.buyer?.login || 'Неизвестен'}
                    </div>
                </div>
                <div className={styles.order_cost}>
                    {order.cost} ₸
                </div>
            </div>

            {/* Контактная информация покупателя */}
            {(order.buyer?.email || order.shippingAddress) && (
                <div className={styles.order_contacts}>
                    {order.buyer?.email && (
                        <div className={styles.contact_info}>
                            Email: {order.buyer.email}
                        </div>
                    )}
                    {order.shippingAddress && (
                        <div className={styles.contact_info}>
                            Адрес: {order.shippingAddress}
                        </div>
                    )}
                </div>
            )}

            {/* Кнопки действий для продавца */}
            <div className={styles.order_actions}>
                <button className={styles.action_button_primary}>
                    Подтвердить заказ
                </button>
                <button className={styles.action_button_secondary}>
                    Отменить
                </button>
            </div>
        </section>
    );
}