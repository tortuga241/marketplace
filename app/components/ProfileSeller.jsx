"use client"

import styles from './ProfileSeller.module.css';
import Header from './Header';
import Footer from './footer';
import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

import { Box, Star, Lightbulb, ShoppingBasket } from 'lucide-react'

import ProfileSellerComp from './UI/profile/profileSellerComp';
import StaticProfile from './UI/profile/static';
import ProductCardS from './UI/profile/productCardS';
import ReviewsSeller from './UI/profile/reviewsSeller';
import RecomendCard from './UI/profile/recomend';
import CreateProductModal from './UI/profile/modalWin';
import SellCart from './UI/profile/sellCart';

import { useApi } from '../src/hooks/useApi';

export default function ProfileSeller({ user, shop, isOwner, sales = [], isLoading, onRefreshOrders }) { 

    const api = useApi();

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [reviewType, setReviewType] = useState("shop"); 
    const [selectedProductId, setSelectedProductId] = useState(null);
    
    const [shopReviews, setShopReviews] = useState([]);
    const [productReviews, setProductReviews] = useState({}); 
    
    const [ReviewsError, setReviewsError] = useState("");
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lots, setLots] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [hasLoadedReviews, setHasLoadedReviews] = useState(false);

    const starArray = [1,2,3,4,5];
    
    const [activeTab, setActiveTab] = useState("products");
    const [hasLoadedOrders, setHasLoadedOrders] = useState(false);
    const prevActiveTabRef = useRef(activeTab);

    const host = process.env.NEXT_PUBLIC_HOST;

    const userId = user?.id || '';
    const shopId = shop?.id || '';
    
    const showAddProductButton = isOwner;
    const showReviewInput = !isOwner;

    const handleLotCreated = (newLot) => {
        setLots(prevLots => [newLot, ...prevLots]);
    };

    // Функция для объединения всех отзывов
    const getAllReviews = useCallback(() => {
        const allReviews = [...shopReviews];
        
        // Добавляем отзывы товаров, избегая дубликатов
        Object.values(productReviews).forEach(productReviewArray => {
            productReviewArray.forEach(review => {
                // Проверяем, нет ли уже этого отзыва в общем списке
                if (!allReviews.some(existingReview => existingReview.id === review.id)) {
                    allReviews.push(review);
                }
            });
        });
        
        return allReviews;
    }, [shopReviews, productReviews]);

    // Функция для расчета среднего рейтинга из ВСЕХ отзывов
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const calculatePositivePercent = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const positiveCount = reviews.filter(review => review.rating >= 4).length;
        return Math.round((positiveCount / reviews.length) * 100); 
    };

    // Функция для получения рейтинга товара
    const getProductRating = (productId) => {
        const reviews = productReviews[productId] || [];
        return {
            average: calculateAverageRating(reviews),
            count: reviews.length
        };
    };

    // Функция для получения общего рейтинга (из ВСЕХ отзывов)
    const getOverallRating = () => {
        const allReviews = getAllReviews();
        const average = calculateAverageRating(allReviews);
        const count = allReviews.length;
        const positivePercent = calculatePositivePercent(allReviews);

        return {
            average: average,
            count: count,
            positivePercent: positivePercent
        };
    };

    //POST запрос на отпраку отзыва
    const handleSubmitReview = async () => {
        if (rating === 0 || review.trim() === "") {
            setSubmitError("Пожалуйста, укажите рейтинг и напишите отзыв.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const reviewData = {
                rating: rating,
                description: review.trim(),
                shopId: shopId
            };

            // Отзыв всегда для магазина
            if (!shopId) {
                setSubmitError("Не удалось получить информацию о магазине.");
                setIsSubmitting(false);
                return;
            }
            await axios.post(`${host}/reviews`, reviewData, { withCredentials: true });
            await fetchShopReviews();
            
            setRating(0);
            setReview("");
            setSubmitError(null);

        } catch (error) {
            console.error("Ошибка отправки отзыва:", error);
            
            if (error.response?.status === 401) {
                setSubmitError("Необходимо авторизоваться для отправки отзыва");
            } else if (error.response?.status === 400) {
                setSubmitError(error.response.data?.message || "Вы уже оставляли отзыв");
            } else if (error.response?.status === 404) {
                setSubmitError("Магазин не найден");
            } else {
                setSubmitError(error.response?.data?.message || error.message || 'Не удалось отправить отзыв');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // GET запрос на вывод товара этого продавца
    useEffect(() => {
        const fetchProfileSellerLot = async () => {
            if (!userId) {
                console.log("Account ID отсутствует. Невозможно загрузить лоты.");
                return;
            }

            try {
                const res = await axios.get(`${host}/lots/by-account/${userId}`);
                const lotsData = res.data;
                setLots(lotsData);
                console.log("Лоты продавца загружены:", lotsData);

                // Загружаем отзывы для каждого товара
                lotsData.forEach(lot => {
                    fetchProductReviews(lot.id);
                });

            } catch (error) {
                console.error("Ошибка при загрузке лотов продавца:", error);
            }
        };

        fetchProfileSellerLot();
    }, [userId]);

    // GET запрос на получение отзывов о магазине
    const fetchShopReviews = useCallback(async () => {
        if (!shopId) {
            console.log("Shop ID отсутствует. Невозможно загрузить отзывы магазина.");
            return;
        }

        setReviewsLoading(true);
        setReviewsError(null);

        try {
            const response = await axios.get(`${host}/reviews/shop/${shopId}`);
            setShopReviews(response.data);
            console.log("Отзывы магазина загружены:", response.data);
            setHasLoadedReviews(true);
        } catch (error) {
            console.error("Ошибка при загрузке отзывов магазина:", error);
            setReviewsError("Не удалось загрузить отзывы магазина");
        } finally {
            setReviewsLoading(false);
        }
    }, [shopId, host]);

    // GET запрос на получение отзывов о товаре
    const fetchProductReviews = useCallback(async (lotId) => {
        if (!lotId) return;

        try {
            const response = await axios.get(`${host}/reviews/lot/${lotId}`);
            setProductReviews(prev => ({
                ...prev,
                [lotId]: response.data
            }));
            console.log(`Отзывы товара ${lotId} загружены:`, response.data);
        } catch (error) {
            console.error(`Ошибка при загрузке отзывов товара ${lotId}:`, error);
        }
    }, [host]);

    useEffect(() => {
        if (activeTab === "reviews" && !hasLoadedReviews) {
            console.log('Загрузка отзывов магазина...');
            fetchShopReviews();
        }
    }, [activeTab, hasLoadedReviews, fetchShopReviews]);

    //Заказы
    useEffect(() => {
        if (activeTab === "orders" && 
            !hasLoadedOrders && 
            isOwner && 
            onRefreshOrders &&
            prevActiveTabRef.current !== "orders") {
            
            console.log('Первая загрузка заказов...');
            onRefreshOrders();
            setHasLoadedOrders(true);
        }
        
        prevActiveTabRef.current = activeTab;
    }, [activeTab, hasLoadedOrders, isOwner, onRefreshOrders]);

    useEffect(() => {
        setHasLoadedOrders(false);
    }, [userId, shopId]);

    const handleManualRefresh = useCallback(() => {
        if (onRefreshOrders) {
            console.log('Ручное обновление заказов...');
            onRefreshOrders();
        }
    }, [onRefreshOrders]);

    //Удаление лота
    const handleDeleteLot = useCallback(async (lotId) => {
        console.log("Запрос на удаление/скрытие лота:", lotId)

        if (!confirm('Вы уверены, что хотите удалить этот лот?')) {
            return;
        }

        try {
            const response = await axios.delete(`${host}/lots/${lotId}`, {withCredentials: true, });

            setLots(prevLots => prevLots.filter(lot => lot.id !== lotId));
            setProductReviews(prev => {
                const newReviews = { ...prev };
                delete newReviews[lotId];
                return newReviews;
            });

            console.log(response.data.message); 

        } catch (error) {
            console.error("Ошибка при удалении/скрытии лота:", error);
            console.log(lotId)
            alert(error.response?.data?.message || "Не удалось удалить лот.");
        }
    }, [setLots]);

    return (
        <div className={styles.main_container_profile_seller}>
            <Header />
            <div className={styles.container_obert}>
                {/* Передаем ОБЩИЙ рейтинг из всех отзывов */}
                <ProfileSellerComp 
                    user={user} 
                    shop={shop} 
                    isOwner={isOwner}  
                /> 
                <StaticProfile order={sales} allReviews={getAllReviews()} />
                <div className={styles.profile_menu_seller}>
                    <div className={`${styles.profile_point_ps} ${activeTab === "products" ? styles.active : ""}`}
                        onClick={() => setActiveTab("products")}><Box width={15} height={15} /> Товары
                    </div>
                    <div className={`${styles.profile_point_ps} ${activeTab === "reviews" ? styles.active : ""}`}
                        onClick={() => setActiveTab("reviews")}><Star width={15} height={15} /> Отзывы
                    </div>
                    <div className={`${styles.profile_point_ps} ${activeTab === "orders" ? styles.active : ""}`}
                        onClick={() => setActiveTab("orders")}><ShoppingBasket width={15} height={15} /> Заказы
                    </div>
                    <div className={`${styles.profile_point_ps} ${activeTab === "tips" ? styles.active : ""}`}
                        onClick={() => setActiveTab("tips")}><Lightbulb width={15} height={15} /> Советы
                    </div>
                </div>
            </div>
             <div className={styles.tab_content}>
                {activeTab === "products" && 
                    (<div className={styles.col_container_ps}>
                        {showAddProductButton && (
                            <button onClick={openModal} className={styles.add_product_but}>+ Добавить товар</button>
                        )}
                        <div className={styles.product_grid_container}>
                            <ProductCardS 
                                isOwner={isOwner} 
                                lots={lots} 
                                onDelete={handleDeleteLot}
                                productRatings={productReviews}
                                getProductRating={getProductRating}
                            />
                        </div>
                    </div>)}
                {activeTab === "reviews" && 
                    <div className={styles.col_container_p}>
                        {showReviewInput && (
                            <div className={styles.review_form_container}>
                                <input 
                                    className={styles.input_add_review_p} 
                                    type="text" 
                                    placeholder='Напишите отзыв о магазине' 
                                    value={review} 
                                    onChange={(e) => setReview(e.target.value)}
                                />
                                
                                <div className={styles.rating_stars}>
                                    {starArray.map((starValue) => (
                                        <Star 
                                            key={starValue} 
                                            size={20} 
                                            onClick={() => setRating(starValue)} 
                                            className={ starValue <= rating ? styles.star_icon_active : styles.star_icon_inactive } 
                                        />
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={handleSubmitReview} 
                                    disabled={rating === 0 || review.trim() === "" || isSubmitting} 
                                    className={styles.but_add_reviews_s}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Опубликовать'}
                                </button>
                            </div>
                        )}
                        {submitError && <p style={{ color: 'red', marginTop: '10px' }}>{submitError}</p>}
                        <ReviewsSeller reviews={shopReviews} />
                    </div>}
                {activeTab === "orders" && 
                    (<div className={styles.col_container_ps}>
                        <div className={styles.orders_header}>
                            <h1>Мои заказы</h1>
                            {isOwner && (
                                <button 
                                    onClick={handleManualRefresh}
                                    disabled={isLoading}
                                    className={styles.refresh_button}
                                >
                                    {isLoading ? 'Обновление...' : 'Обновить'}
                                </button>
                            )}
                        </div>
                        <div className={styles.orders_container}>
                            {isLoading ? (
                                <p>Загрузка заказов...</p>
                            ) : sales && sales.length > 0 ? (
                                sales.map((order) => (
                                    <SellCart key={order.id} order={order} />
                                ))
                            ) : (
                                <p>У вас пока нет заказов</p>
                            )}
                        </div>
                    </div>)}
                {activeTab === "tips" && <div><RecomendCard /></div>}
            </div>
            {showAddProductButton && isModalOpen && <CreateProductModal accountId={userId} shopId={shopId} onLotCreated={handleLotCreated} onClose={closeModal} />}
            <Footer />
        </div>
    )
}