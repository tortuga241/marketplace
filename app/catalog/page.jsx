import styles from './styles.module.css';

import Header from '../components/Header';
import { Filter } from 'lucide-react';

export default function CatalogPage() {
    return (
        <div className={styles.main_container_cp}>
            <Header />
            <div className={styles.row_container_cp}>
                <div className={styles.filter_col_container}>
                    <div className={styles.filter_txt_title}><Filter size={20} color='purple'/> Фильтры</div>
                    <div className={styles.type_filter_cp}></div>
                    <div className={styles.sort_filter_cp}></div>
                    <div className={styles.rating_filter_cp}></div>
                    <button className={styles.drop_filter}>Сбросить фильтры</button>
                </div>
                <div className={styles.product_container_cp}>
                    <div className={styles.title_container_cp}>
                        <h1>Каталог товаров</h1>
                        <p className={styles.txt_title_cp}>Найдено 9 товаров</p>
                    </div>
                </div>
            </div>
        </div>
    )
}