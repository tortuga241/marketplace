"use client"

import styles from './ProfileSeller.module.css';
import Header from './Header';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Box, Star, Lightbulb } from 'lucide-react'

import ProfileSellerComp from './UI/profile/profileSellerComp';
import StaticProfile from './UI/profile/static';
import ProductCardS from './UI/profile/productCardS';
import ReviewsSeller from './UI/profile/reviewsSeller';
import RecomendCard from './UI/profile/recomend';
import CreateProductModal from './UI/profile/modalWin';

// Принимаем isOwner
export default function ProfileSeller({ user, shop, isOwner }) { 

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lots, setLots] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const starArray = [1,2,3,4,5];
    
    const [activeTab, setActiveTab] = useState("products");

    const host = "http://localhost:3001";

    const userId = user?.id || '';
    const shopId = shop?.id || '';
    
    // Флаги видимости
    const showAddProductButton = isOwner;
    const showReviewInput = !isOwner;

    const handleLotCreated = (newLot) => {
        setLots(prevLots => [newLot, ...prevLots]);
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
                setLots(res.data);
                console.log("Лоты продавца загружены:", res.data);

            } catch (error) {
                console.error("Ошибка при загрузке лотов продавца:", error);
            }
        };

        fetchProfileSellerLot();
    }, [userId]);


    //Удалиние лота по ID
    const handleDeleteLot = useCallback(async (lotId) => {

        console.log("Айди лота:", lotId)

        if (!confirm('Вы уверены, что хотите удалить этот лот?')) {
            return;
        }

        try {
            await axios.delete(`${host}/lots/${lotId}`, {withCredentials: true, });

            setLots(prevLots => prevLots.filter(lot => lot.id !== lotId));
            
            console.log(`Лот ${lotId} успешно удален.`);

        } catch (error) {
            console.error("Ошибка при удалении лота:", error);
            console.log(lotId)
            alert(error.response?.data?.message || "Не удалось удалить лот.");
        }
    }, [setLots]);
    

    return (
        <div className={styles.main_container_profile_seller}>
            <Header />
            <div className={styles.container_obert}>
                {/* Передаем user, shop, и isOwner в UI компонент */}
                <ProfileSellerComp user={user} shop={shop} isOwner={isOwner} /> 
                <StaticProfile />
                <div className={styles.profile_menu_seller}>
                    <div className={`${styles.profile_point_ps} ${activeTab === "products" ? styles.active : ""}`}
                        onClick={() => setActiveTab("products")}><Box width={15} height={15} /> Товары
                    </div>
                    <div className={`${styles.profile_point_ps} ${activeTab === "reviews" ? styles.active : ""}`}
                        onClick={() => setActiveTab("reviews")}><Star width={15} height={15} /> Отзывы
                    </div>
                    <div className={`${styles.profile_point_ps} ${activeTab === "tips" ? styles.active : ""}`}
                        onClick={() => setActiveTab("tips")}><Lightbulb width={15} height={15} /> Советы
                    </div>
                </div>
            </div>
             <div className={styles.tab_content}>
                {activeTab === "products" && 
                    (<div className={styles.col_container_ps}>
                        {/* Скрываем кнопку Добавить товар, если это не владелец */}
                        {showAddProductButton && (
                            <button onClick={openModal} className={styles.add_product_but}>+ Добавить товар</button>
                        )}
                        <div className={styles.product_grid_container}><ProductCardS isOwner={isOwner} lots={lots} onDelete={handleDeleteLot} /></div>
                    </div>)}
                {activeTab === "reviews" && 
                    <div className={styles.col_container_p}>
                        {/* Скрываем форму отзыва, если это сам владелец */}
                        {showReviewInput && (
                            <div className={styles.row_container_p}>
                                <input className={styles.input_add_review_p} type="text" placeholder='Напишите короткий отзыв' value={review} onChange={(e) => setReview(e.target.value)}/>
                                {starArray.map((starValue) => (
                                    <Star key={starValue} size={20} onClick={() => setRating(starValue)} className={ starValue <= rating ? styles.star_icon_active : styles.star_icon_inactive } />
                                ))}
                                <button disabled={rating === 0 || review === ""}  className={styles.but_add_reviews_s}>Опубликовать</button>
                            </div>
                        )}
                        <ReviewsSeller />
                    </div>}
                {activeTab === "tips" && <div><RecomendCard /></div>}
            </div>
            {/* Скрываем модальное окно для не-владельца */}
            {showAddProductButton && isModalOpen && <CreateProductModal accountId={userId} shopId={shopId} onLotCreated={handleLotCreated} onClose={closeModal} />}
        </div>
    )
}