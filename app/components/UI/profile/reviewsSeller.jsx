import styles from './styles/reviewsSeller.module.css';
import { Star } from 'lucide-react';

export default function ReviewsSeller() {

    const reviews = [
        {
            id: 1,
            userLogin: 'Dmitry',
            date: '15 Марта 2025',
            text: 'Отличный продавец, все сделал вовремя а главное качественно!',
            numRev: 5,
        },
        {
            id: 2,
            userLogin: 'Viktor',
            date: '26 Июля 2025',
            text: 'Отличный продавец, во время!',
            numRev: 5,
        },
        {
            id: 3,
            userLogin: 'Lera',
            date: '26 Сентября 2025',
            text: 'Продавец не очень, сделал свою работу плохо',
            numRev: 1,
        },
        {
            id: 4,
            userLogin: 'Vika',
            date: '15 Марта 2025',
            text: 'Приемлемо',
            numRev: 3,
        },
    ];

    //Отрисовка нужного кол-ва звезд
    const renderFullRating = (rating) => {
        const totalStars = 5;
        const stars = [];

        // Заполненные звёзды
        for (let i = 0; i < rating; i++) {
            stars.push(
                <Star key={`full-${i}`} size={16} fill="#6500f3" color="#6500f3" />
            );
        }
        // Пустые звёзды
        for (let i = rating; i < totalStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} size={16} fill="none" color="gray" />
            );
        }
        return stars;
    };

    return (
        <>
        {reviews.map((review) => (
            <div key={review.id} className={styles.main_container_card_rps}>
                <div className={styles.row_container_rps}>
                    <p className={styles.user_login_rps}>{review.userLogin}</p>
                    <div className={styles.stars_container_rps}>{renderFullRating(review.numRev)}</div>
                </div>
                <p className={styles.date_rps}>{review.date}</p>
                <div className={styles.review_txt_rps}>{review.text}</div>
            </div>
        ))}
        </>
    )
}