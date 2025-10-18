"use client"

import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import Header from '../../components/Header';
import ProductHeader from '../../components/UI/productHeader/productHeader';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ProductPage() {

    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const starArray = [1,2,3,4,5];

    const host = "http://localhost:3001"

    //ограничение символов
    const handleReviewChange = (e) => {
        const value = e.target.value;
        if (value.length <= 120) {
            setReview(value);
        }
    };

    //GET запрос на получение информации о конкреном продукте по ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${host}/lots/${productId}`);

                console.log(response.data)
                if(!response) {
                    throw new Error("Продукт не найден")
                }

                setProduct(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    //При загрузки
    if (loading) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.error}>Ошибка: {error}</div>
            </div>
        );
    }
    if (!product) {
        return (
            <div className={styles.main_container_product_pp}>
                <Header />
                <div className={styles.error}>Продукт не найден</div>
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
                        <button disabled={rating === 0 || review === ""}  className={styles.but_add_reviews_s}>Опубликовать</button>
                    </div>
                    <div className={styles.reviews_container_pp}></div>
                </div>
            </div>
        </div>
    )
}