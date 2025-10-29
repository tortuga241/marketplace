"use client"

import { useState, useEffect, use } from 'react';
import { Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'next/navigation';
import styles from './styles.module.css';

import Header from '../../components/Header';
import Footer from '../../components/footer';
import ProductHeader from '../../components/UI/productHeader/productHeader';
import ReviewsSeller from '../../components/UI/profile/reviewsSeller';

import { useApi } from '../../src/hooks/useApi';

export default function ProductPage() {

    const params = useParams();
    const productId = params.id as string;
    const api = useApi();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState(""); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [submitError, setSubmitError] = useState(null);
    const starArray = [1,2,3,4,5];

    const [currentUser, setCurrentUser] = useState(null);

    // Функция для получения текущего пользователя
    const fetchCurrentUser = async () => {
        try {
            const userData = await api.getProfile();
            setCurrentUser(userData);
        } catch (err) {
            console.log("Пользователь не авторизован");
            setCurrentUser(null);
        } 
    };

    //ограничение символов
    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 120) {
            setReview(value);
        }
    };


    //GET запрос на вывод отзыва к лоту
    const fetchReviews = async (id: string) => {
        try {
            //Передаем данные типизируя их используя any
            const reviewsData: any = await api.getReviewsForLot(id); 
            setReviews(reviewsData || []);
        } catch (err: any) {
            console.error("Ошибка при загрузке отзывов:", err);
            setReviews([]);
        }
    };
    

    //POST запрос на отпарвку отзыва
    const handleSubmitReview = async () => {

        if (rating === 0 || review.trim() === "") {
            setSubmitError("Пожалуйста, укажите рейтинг и напишите отзыв.");
            return;
        }

        if (!product || !product.shopId) {
            setSubmitError("Не удалось получить информацию о магазине.");
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError(null);
        
        
        const reviewData = {
            shopId: product.shopId,
            lotId: productId,
            rating: rating,
            description: review.trim(),
        };

        try {
            await api.createReview(reviewData);

            // Сброс формы и обновление списка
            setRating(0);
            setReview("");
            await fetchReviews(productId);

        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Не удалось отправить отзыв';
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };


    //GET запрос на получение информации о конкреном продукте по ID
    useEffect(() => {

        if (!productId) return; 

        const fetchData = async () => { 
            try {
                setLoading(true);
                setError(null);

                const productData: any = await api.getLotById(productId);
                
                if (!productData) {
                    throw new Error("Продукт не найден");
                }

                setProduct(productData);
                await fetchReviews(productId); 
                await fetchCurrentUser()

            } catch (err: any) {
                const message = err.response?.data?.message || err.message || "Неизвестная ошибка при загрузке данных";
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchData(); 
    }, [productId, api]);

    //При загрузки
    if (loading) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.loading}>Загрузка...</div>
                <Footer />
            </div>
        );
    }
    if (error) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.error}>Ошибка: {error}</div>
                <Footer />
            </div>
        );
    }
    if (!product) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.error}>Продукт не найден</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.main_container_product_pp}>
            <Header />
            <div className={styles.obert_container}>
                <ProductHeader product={product}/>
                <div className={styles.container_markdown}>
                    <ReactMarkdown>{product.description}</ReactMarkdown>
                </div>
                <div className={styles.col_container_pp}>
                    <h2>Отзывы</h2>

                    {currentUser && product && currentUser.id !== product.accountId ? (
                        <div className={styles.row_container_pp}>
                            <input
                                className={styles.input_add_review_p}
                                type="text"
                                placeholder="Напишите короткий отзыв"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                maxLength={120}
                            />
                            <div className={styles.char_counter}>{review.length}/120</div>

                            {starArray.map((starValue) => (
                                <Star
                                    key={starValue}
                                    size={20}
                                    onClick={() => setRating(starValue)}
                                    className={
                                        starValue <= rating
                                            ? styles.star_icon_active
                                            : styles.star_icon_inactive
                                    }
                                />
                            ))}

                            <button
                                onClick={handleSubmitReview}
                                disabled={
                                    rating === 0 || review.trim() === "" || isSubmitting
                                }
                                className={styles.but_add_reviews_s}
                            >
                                {isSubmitting ? "Отправка..." : "Опубликовать"}
                            </button>
                        </div>
                    ) : (
                        currentUser && currentUser.id === product.accountId && (
                            <p className={styles.review_disabled_notice}>
                                Вы не можете оставлять отзывы на свои товары.
                            </p>
                        )
                    )}

                    {/* Вывод списка отзывов */}
                    <div className={styles.reviews_container_pp}>
                        {reviews.length > 0 ? (
                            <ReviewsSeller reviews={reviews} currentUser={currentUser} />
                        ) : (
                            <p>Пока нет отзывов. Будьте первым!</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}