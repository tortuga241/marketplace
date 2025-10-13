import styles from './styles/recomend.module.css';
import { Lightbulb } from 'lucide-react';

export default function RecomendCard() {

    const recomends = [
        {
            id: 1, 
            title: "Увеличение продаж",
            text: "Добавте подробные описания и примеры использования ваших материалов",
        },
        {
            id: 2, 
            title: "Увеличение рейтинга",
            text: "Отвечайте на вопросы покупателей в течение 24 часов",
        },
        {
            id: 3, 
            title: "Оптимизация",
            text: "Используйте ключевые слова в названиях для лучшей видимости",
        },
    ]

    return (
        <>
        {recomends.map((recomend) => (
            <div key={recomend.id} className={styles.main_container_reccomends_ps}>
                <div className={styles.tip_card_icon_wrapper}>
                    <Lightbulb size={20} className={styles.tip_card_icon} />
                </div>
                <div className={styles.tip_card_content}>
                    <h3 className={styles.tip_card_title}>{recomend.title}</h3>
                    <p className={styles.tip_card_description}>{recomend.text}</p>
                </div>
            </div>
        ))}
        </>
    )
}