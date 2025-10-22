// import styles from './styles/historyBuy.module.css';

// export default function HistoryCart({ order }) {

//     const history = [
//         {
//             id: 1,
//             date: "16 мая 2025",
//             title: "Курс по програмированию Python",
//             type: "Видео",
//             totalPrice: "27,500 ₸",
//         },
//         {
//             id: 2,
//             date: "15 марта 2025",
//             title: "Курс по програмированию JavaScript",
//             type: "Видео",
//             totalPrice: "18,000 ₸",
//         },
//         {
//             id: 3,
//             date: "22 февраля 2025",
//             title: "Курс по графическому дизайну",
//             type: "Видео",
//             totalPrice: "9,900 ₸",
//         },
//         {
//             id: 4,
//             date: "27 января 2025",
//             title: "Документация к Photoshop2025",
//             type: "Документ",
//             totalPrice: "12,400 ₸",
//         },
//         {
//             id: 5,
//             date: "3 января 2025",
//             title: "Статья про футбольную команду",
//             type: "Статья",
//             totalPrice: "32,700 ₸",
//         },
//     ]

//     return (
//         <>
//             {history.map((histor) => (
//                 <section key={histor.id} className={styles.history_card_container}>
//                     <div className={styles.row_container}>
//                         <div className={styles.col_container}>
//                             <div className={styles.titls}>
//                                 <p className={styles.title_history_card}>{histor.title}</p>
//                                 <p className={styles.type_history_card}>{histor.type}</p>
//                             </div>
//                             <div className={styles.history_date}>{histor.date}</div>
//                         </div>
//                         <p className={styles.history_cost}>{histor.totalPrice}</p>
//                     </div>
//                 </section>
//             ))}
//         </>
//     )
// }


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