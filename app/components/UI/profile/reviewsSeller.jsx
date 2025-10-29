"use client"

import styles from './styles/reviewsSeller.module.css';
import { Star, Trash2 } from 'lucide-react';
import { useState } from 'react'; 

import { useApi } from '../../../src/hooks/useApi';

export default function ReviewsSeller({ reviews, currentUser }) {
    const api = useApi();
    const [currentReviews, setCurrentReviews] = useState(reviews); 

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
            return isoString;
        }
    }

    //DELETE удаление отзыва по id
    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            return;
        }

        try {
            const response = await api.deleteReview(reviewId);

            console.log("Удаленный отзыв:", response)
            setCurrentReviews(prev => prev.filter(review => review.id !== reviewId));
            alert('Отзыв успешно удален');
            
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        alert('Необходимо авторизоваться');
                        break;
                    case 403:
                        alert('У вас нет прав на удаление этого отзыва');
                        break;
                    case 404:
                        alert('Отзыв не найден');
                        break;
                    default:
                        alert('Произошла ошибка при удалении отзыва');
                }
            } else {
                alert('Произошла ошибка при удалении отзыва');
            }
        }
    };

    // Проверяем, является ли пользователь владельцем отзыва
    const isReviewOwner = (review) => {
        return currentUser && review.account?.id === currentUser.id;
    };

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
                {isReviewOwner(review) && (
                    <div className={styles.icon_del} onClick={() => handleDeleteReview(review.id)} title="Удалить отзыв">
                        <Trash2 size={20} />
                    </div>
                )}
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