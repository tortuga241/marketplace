"use client"

import styles from './ProfileSeller.module.css';
import Header from './Header';
import { use, useState } from 'react';

import { Box, Star, Lightbulb } from 'lucide-react'

import ProfileSellerComp from './UI/profile/profileSeller';
import StaticProfile from './UI/profile/static';
import ProductCardS from './UI/profile/productCardS';
import ReviewsSeller from './UI/profile/reviewsSeller';
import RecomendCard from './UI/profile/recomend';

export default function ProfileSeller() {

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");

    const starArray = [1,2,3,4,5];
    
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className={styles.main_container_profile_seller}>
            <Header />
            <div className={styles.container_obert}>
                <ProfileSellerComp />
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
                        <button className={styles.add_product_but}>+ Добавить товар</button>
                        <div className={styles.product_grid_container}><ProductCardS /></div>
                    </div>)}
                {activeTab === "reviews" && 
                    <div className={styles.col_container_p}>
                        <div className={styles.row_container_p}>
                            <input className={styles.input_add_review_p} type="text" placeholder='Напишите короткий отзыв' value={review} onChange={(e) => setReview(e.target.value)}/>
                            {starArray.map((starValue) => (
                                <Star key={starValue} size={20} onClick={() => setRating(starValue)} className={ starValue <= rating ? styles.star_icon_active : styles.star_icon_inactive } />
                            ))}
                            <button disabled={rating === 0 || review === ""}  className={styles.but_add_reviews_s}>Опубликовать</button>
                        </div>
                        <ReviewsSeller />
                    </div>}
                {activeTab === "tips" && <div><RecomendCard /></div>}
            </div>
        </div>
    )
}