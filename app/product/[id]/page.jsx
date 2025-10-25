"use client"

import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import Header from '../../components/Header';
import ProductHeader from '../../components/UI/productHeader/productHeader';
import Footer from '@/app/components/footer';
import axios from 'axios';
import { useParams } from 'next/navigation';

import ReviewsSeller from '@/app/components/UI/profile/reviewsSeller';

export default function ProductPage() {

    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState(""); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [submitError, setSubmitError] = useState(null);
    const starArray = [1,2,3,4,5];

    const host = process.env.NEXT_PUBLIC_HOST;

    //ограничение символов
    const handleReviewChange = (e) => {
        const value = e.target.value;
        if (value.length <= 120) {
            setReview(value);
        }
    };

    const fetchReviews = async (id) => {
        try {
            const response = await axios.get(`${host}/reviews/lot/${id}`);
            setReviews(response.data);
        } catch (err) {
            console.error("Ошибка при загрузке отзывов:", err);
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
            await axios.post(`${host}/reviews`, reviewData, {withCredentials: true});

            // Сброс формы и обновление списка
            setRating(0);
            setReview("");
            await fetchReviews(productId);

        } catch (err) {
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

                const productResponse = await axios.get(`${host}/lots/${productId}`);
                
                if(!productResponse.data) {
                    throw new Error("Продукт не найден")
                }

                setProduct(productResponse.data);

                await fetchReviews(productId); 

            } catch (err) {
                const message = err.response?.data?.message || err.message || "Неизвестная ошибка при загрузке данных";
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        fetchData(); 
    }, [productId, host]);

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
                    <div className={styles.row_container_pp}>
                        <input className={styles.input_add_review_p} type="text" placeholder='Напишите короткий отзыв' value={review} onChange={(e) => setReview(e.target.value)} maxLength={120}/>
                            <div className={styles.char_counter}>{review.length}/120</div>
                        {starArray.map((starValue) => (
                            <Star key={starValue} size={20} onClick={() => setRating(starValue)} className={ starValue <= rating ? styles.star_icon_active : styles.star_icon_inactive } />
                        ))}
                        <button onClick={handleSubmitReview} disabled={rating === 0 || review.trim() === "" || isSubmitting} className={styles.but_add_reviews_s}>
                            {isSubmitting ? 'Отправка...' : 'Опубликовать'}
                        </button>
                    </div>
                    <div className={styles.reviews_container_pp}>
                        {reviews.length > 0 ? (
                            <ReviewsSeller reviews={reviews} /> 
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