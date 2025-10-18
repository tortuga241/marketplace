import styles from './style/cardProduct.module.css';
import { Heart, Star } from 'lucide-react';

export default function CardProduct({ product }) {

    const MAX_DESCRIPTION_LENGTH = 20;

    const truncateDescription = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) {
            return text;
        }

        return text.substring(0, maxLength) + '...';
    };
    
    //Если что-то пойдет не так
    if (!product) {
        return (
             <div className={styles.main_container_card_cp}>
                <p>Нет данных о продукте</p>
             </div>
        );
    };

    const handleInfoProduct = () => {
        window.location.href = `/product/${product.id}`
    }

    const shortDescription = truncateDescription(product.description, MAX_DESCRIPTION_LENGTH);

    return (
        <div key={product.id} className={styles.main_container_card_cp}>
            <div className={styles.row_container_cp}>
                <p className={styles.type_txt_cp_card}>{product.type}</p>
                <Heart size={20} className={styles.icon_card_cp} />
            </div>
            <div className={styles.col_container_cp}>
                <h3 className={styles.title_card_cp}>{product.title}</h3>
                <p className={styles.description_card_cp}>{shortDescription}</p>
                <div className={styles.row_container_cp_rating}>
                    <Star size={16} fill='#6500f3' color='#6500f3' />
                    <p className={styles.num_rating}>{product.grade}</p>
                    <p className={styles.num_rating_cp}>({product.gradeNum} отзывов)</p>
                </div>
            </div>
            <div className={styles.decoration_container_cp}></div>
            <div className={styles.row_container_cp}>
                <p className={styles.cost_cp}>{product.price}₸</p>
                <button onClick={handleInfoProduct} className={styles.but_buy_cp}> Подробнее</button>
            </div>
        </div>
    )
}