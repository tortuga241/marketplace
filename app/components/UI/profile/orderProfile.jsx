import styles from './styles/orderProfile.module.css'

export default function OrderProfileCart() {

    const orders = [
        {
            id: 1,
            code: "ORD-001",
            date: "2025-10-06",
            status: "Готов",
            totalItems: "Уроки програмирования",
            totalPrice: "27,500 ₸",
        },
        {
            id: 2,
            code: "ORD-002",
            date: "2025-09-28",
            status: "В работе",
            totalItems: "Научная работа",
            totalPrice: "18,000 ₸",
        },
        {
            id: 3,
            code: "ORD-003",
            date: "2025-09-15",
            status: "Ожидает оплаты",
            totalItems: "Статья",
            totalPrice: "9,900 ₸",
        },
        {
            id: 4,
            code: "ORD-004",
            date: "2025-08-30",
            status: "Отменён",
            totalItems: "Текстовый документ",
            totalPrice: "12,400 ₸",
        },
        {
            id: 5,
            code: "ORD-005",
            date: "2025-07-19",
            status: "Готов",
            totalItems: "Видео архив",
            totalPrice: "32,700 ₸",
        },
    ]

    return (
        <>
            {orders.map((order) => (
                <section key={order.id} className={styles.main_container_order_cart}>
                    <div className={styles.order_row_container}>
                        <div className={styles.col_container}>
                            <p className={styles.order_code}>Заказ: {order.code}</p>
                            <p className={styles.order_date}>{order.date}</p>
                        </div>
                        <div 
                            className={`${styles.status_order_order} ${
                                order.status === "Готов"
                                    ? styles.status_delivered
                                    : order.status === "Ожидает оплаты"
                                    ? styles.status_shipping
                                    : order.status === "В работе"
                                    ? styles.status_cancelled
                                    : order.status === "Отменён"
                                    ? styles.status_del
                                    : order.status === "Ожидает оплаты"
                            }`}
                        >
                            {order.status}
                        </div>
                    </div>
                    <div className={styles.order_row_container}>
                        <div className={styles.order_num}>Товар: {order.totalItems}</div>
                        <div className={styles.order_cost}>{order.totalPrice}</div>
                    </div>
                </section>
            ))}
        </>
    )
}
