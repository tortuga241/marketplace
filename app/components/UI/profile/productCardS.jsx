import styles from './styles/cardProductS.module.css';
import { Star, Trash2 } from 'lucide-react';

export default function ProductCardS() {

    const products = [
        {
            id: 1,
            title: 'Курс по веб разработке',
            type: 'Видео',
            reviews: 4.8,
            cost: '50.000₸',
        },
          {
            id: 2,
            title: 'Курс по beckend',
            type: 'Видео',
            reviews: 5,
            cost: '66.000₸',
        },
          {
            id: 3,
            title: 'Документация к backend',
            type: 'Документ',
            reviews: 4.5,
            cost: '10.000₸',
        },
          {
            id: 4,
            title: 'Статья по IT',
            type: 'Сатья',
            reviews: 4.0,
            cost: '80.000₸',
        }
    ];

    
    return (
        <>
        {products.map((product) => (
            <div key={product.id} className={styles.main_container_card_cps}>
            <div className={styles.col_container_cps}>
                <div className={styles.row_container_cps}>
                    <p className={styles.title_card_cps}>{product.title}</p>
                    <div className={styles.type_card_cps}>{product.type}</div>
                </div>
            </div>
            <div className={styles.icon_reviw_cps}><Star width={15} height={15} fill='#6500f3' color='#6500f3' />{product.reviews}</div>
            <div className={styles.col_container_cps}>
                <div className={styles.row_container_cps}>
                    <div className={styles.cost_cps}>{product.cost}</div>
                </div>
                <div className={styles.row_container_cps}>
                    <button className={styles.buy_but_cps}>Купить</button>
                    <button className={styles.delete_cps}><Trash2 width={16} height={16} /></button>
                </div>
            </div>
        </div>
        ))}
        </>
    )
}