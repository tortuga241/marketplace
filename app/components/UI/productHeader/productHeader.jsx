import styles from './style/styles.module.css';
import { Download, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductHeader({ product }) {

    //Функция для покупки товара
    const handleBuyLot = () => {
        window.location.href = "/buy-product"
    }

    //Формирование даты добавления товара
    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    const sellerId = product.accountId;
    const sellerLogin = product.shop.owner.login
    console.log(sellerId);



    return (
        <div className={styles.product_header_main}>
            <div className={styles.row_container_ph}>
                <div className={styles.type_product_ph}>{product.type}</div>
                <div className={styles.beta_status}>Доступна BETA</div>
            </div>
            <h1 className={styles.title_product_ph}>{product.title}</h1>
            <div className={styles.row_container_p}>
                <div className={styles.row_ph}>Продавец: <Link href={sellerId ? `/profile/${sellerId}` : '#'} passHref><p className={styles.black_color}>{sellerLogin}</p></Link></div>
                <div className={styles.row_ph}>Создано:<p className={styles.black_color}>{formatDate(product.createdAt)}</p></div>
            </div>
            <div className={styles.col_ph}>Цена <p className={styles.black_color_ph}>{product.cost}₸</p></div>
            <div className={styles.but_container_ph}>
                <button onClick={handleBuyLot} className={styles.but_buy_ph}><ShoppingCart size={16} /> Купить</button>
                <button className={styles.but_bet_version_ph}><Download size={16} /> Получить BETA версию</button>
            </div>
        </div>
    )
}