"use client"

import styles from './ProfileUser.module.css';
import ProfileUser from './UI/profileUser';
import Header from './Header';
import { Heart, Package, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

//Профиль покупателя и продавца
import OrderProfileCart from './UI/orderProfile';
import HistoryCart from './UI/historyBuy';;
import FavoriteCard from './UI/favor';

//Профиль продавца
import ProfileSellerComp from './UI/profile/profileSeller';
import StaticProfile from './UI/profile/static';
import ProductCardS from './UI/profile/productCardS';
import ReviewsSeller from './UI/profile/reviewsSeller';
import RecomendCard from './UI/profile/recomend';

export default function ProfilePage() {

    const [active, setActive] = useState('orders'); 
    const [ifShop, setIfShop] = useState(false);
    
    return (
        <div className={styles.main_container_profile}>
            <Header />
            <div className={styles.container_obert}>
                <ProfileUser />
                <div className={styles.profile_menu_user}>
                    <div className={`${styles.profile_point} ${active === 'orders' ? styles.active : ''}`}
                        onClick={() => setActive('orders')}><Package width={14} height={14}/> Мои заказы</div>
                    <div className={`${styles.profile_point_2} ${active === 'history' ? styles.active : ''}`}
                        onClick={() => setActive('history')}><ShoppingBag width={14} height={14}/> История покупок</div>
                    <div className={`${styles.profile_point} ${active === 'favorites' ? styles.active : ''}`}
                        onClick={() => setActive('favorites')}><Heart width={14} height={14}/> Избранное</div>
                </div>
                {/* Контейнеры контента */}
                {active === 'orders' && (
                    <div className={styles.order_list_profile}>
                        <OrderProfileCart />
                    </div>
                )}

                {active === 'history' && (
                    <div className={styles.order_list_profile}>
                        <HistoryCart />
                    </div>
                )}

                {active === 'favorites' && (
                    <div className={styles.favor_list_profile}>
                        <FavoriteCard />
                    </div>
                )}
            </div>
        </div>
    )
};