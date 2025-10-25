import styles from './styles/reviewsSeller.module.css';
import { Star } from 'lucide-react';

export default function ReviewsSeller({ reviews }) {
    // Убираем дубликаты по ID
    const uniqueReviews = reviews.filter((review, index, self) => 
        index === self.findIndex(r => r.id === review.id)
    );

    const renderFullRating = (rating) => {
        const totalStars = 5;
        const stars = [];

        // Проверка на допустимый диапазон рейтинга
        const safeRating = Math.max(0, Math.min(5, rating));

        // Заполненные звёзды
        for (let i = 0; i < safeRating; i++) {
            stars.push(
                <Star key={`full-${i}`} size={16} fill="#6500f3" color="#6500f3" />
            );
        }
        // Пустые звёзды
        for (let i = safeRating; i < totalStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} size={16} fill="none" color="gray" />
            );
        }
        return stars;
    };
    
    // Форматирование даты
    const formatDate = (isoString) => {
        if (!isoString) return 'Дата неизвестна';
        try {
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return new Date(isoString).toLocaleDateString('ru-RU', options);
        } catch (e) {
            return isoString; // Fallback
        }
    }

    // Если нет отзывов
    if (uniqueReviews.length === 0) {
        return (
            <div className={styles.no_reviews}>
                <p>Пока нет отзывов</p>
            </div>
        );
    }

    return (
        <>
        {uniqueReviews.map((review) => (
            <div key={review.id} className={styles.main_container_card_rps}>
                <div className={styles.row_container_rps}>
                    <p className={styles.user_login_rps}>{review.account?.login}</p> 
                    <div className={styles.stars_container_rps}>{renderFullRating(review.rating)}</div>
                </div>
                <p className={styles.date_rps}>{formatDate(review.createdAt)}</p>
                <div className={styles.review_txt_rps}>{review.description}</div>
            </div>
        ))}
        </>
    )
}