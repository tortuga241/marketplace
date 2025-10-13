import styles from './styles/static.module.css'
import { Box, Star, MessageSquare, TrendingUp } from 'lucide-react'

export default function StaticProfile() {
    return (
        <div className={styles.static_container_ps}>
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><Box width={16} height={16} />Успешных заказов</div>
                <div className={styles.num_ps} style={{color: '#53CC27'}}>1,247</div>
                <div className={styles.row_container_ps} style={{color: '#53CC27'}}><TrendingUp width={14} height={14} /> +12% за месяц</div>
            </div>
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><Star width={16} height={16} />Средний рейтинг</div>
                <div className={styles.num_ps} style={{color: '#6500f3'}}>4.8</div>
                <div className={styles.row_container_ps} style={{color: '#6500f3'}}><Star width={17} height={17} fill="#6500f3" /><Star width={17} height={17} fill="#6500f3" /><Star width={17} height={17} fill="#6500f3" /><Star width={17} height={17} fill="#6500f3" /><Star width={17} height={17} fill="#6500f3" /></div>
            </div>
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><MessageSquare width={16} height={16} />Отзывы</div>
                <div className={styles.num_ps} style={{color: '#6500f3'}}>241</div>
                <div className={styles.col_container_ps}>
                    <div className={styles.decoration_container_ps}><div className={styles.color_container}></div></div>
                    <div className={styles.txt_ps}>96% положительных</div>
                </div>
            </div>
        </div>
    )
}