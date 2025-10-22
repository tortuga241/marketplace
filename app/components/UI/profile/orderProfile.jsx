import styles from './styles/orderProfile.module.css'

export default function OrderProfileCart({ order }) {
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

    // Определение статуса заказа
    const getStatusInfo = (status) => {
        const statusMap = {
            'completed': { text: 'Готов', className: styles.status_delivered },
            'in_progress': { text: 'В работе', className: styles.status_cancelled },
            'pending': { text: 'Ожидает оплаты', className: styles.status_shipping },
            'cancelled': { text: 'Отменён', className: styles.status_del },
            'delivered': { text: 'Доставлен', className: styles.status_delivered }
        };
        
        return statusMap[status] || { text: status, className: styles.status_shipping };
    };

    const statusInfo = getStatusInfo(order.status);
    const orderDate = formatDate(order.createdAt || order.date);

    return (
        <section className={styles.main_container_order_cart}>
            <div className={styles.order_row_container}>
                <div className={styles.col_container}>
                    <p className={styles.order_code}>Заказ: {order.code}</p>
                    <p className={styles.order_date}>{orderDate}</p>
                </div>
                <div className={`${styles.status_order_order} ${statusInfo.className}`}>
                    {statusInfo.text}
                </div>
            </div>
            <div className={styles.order_row_container}>
                <div className={styles.order_num}>
                    Товар: {order.lot.title}
                </div>
                <div className={styles.order_cost}>{order.cost|| order.totalAmount} ₸</div>
            </div>
            
            {/* Дополнительная информация для отладки */}
            {order.type && (
                <div className={styles.order_row_container}>
                    <div className={styles.order_type}>
                        Тип: {order.type === 'purchase' ? 'Покупка' : 'Продажа'}
                    </div>
                </div>
            )}
        </section>
    );
}
