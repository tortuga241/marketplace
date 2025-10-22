"use client"

import styles from './ProfileUser.module.css';
import ProfileUserUI from './UI/profile/profileUser'; 
import Header from './Header';
import { Heart, Package, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

//Профиль покупателя и продавца
import OrderProfileCart from './UI/profile/orderProfile';
import HistoryCart from './UI/profile/historyBuy';
import FavoriteCard from './UI/profile/favor';

export default function BuyerProfile({ user, isOwner, orders = [], sales = [], isLoading = false, onRefreshOrders }) {

    console.log('BuyerProfile received:', { 
        user, 
        isOwner, 
        ordersCount: orders.length, 
        salesCount: sales.length,
        orders,
        sales
    });

    const allOrders = [...orders.map(order => ({ ...order, type: 'purchase' })), ...sales.map(order => ({ ...order, type: 'sale' }))];
    const sortedOrders = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Фильтруем только покупки для истории
    const purchaseHistory = orders.filter(order => 
        order.status === 'completed' || order.status === 'delivered'
    );

    const [active, setActive] = useState(isOwner ? 'orders' : 'favorites'); 
    
    useEffect(() => {
        if (!isOwner && active !== 'favorites') {
            setActive('favorites');
        } else if (isOwner && active === 'favorites') {
            setActive('orders');
        }
    }, [isOwner]);
    
    const showPrivateSections = isOwner; 

    return (
        <div className={styles.main_container_profile}>
            <Header />
            <div className={styles.container_obert}>
                <ProfileUserUI user={user} isOwner={isOwner} /> 
                <div className={styles.profile_menu_user}>
                    {showPrivateSections && (
                        <>
                            <div className={`${styles.profile_point} ${active === 'orders' ? styles.active : ''}`}
                                onClick={() => setActive('orders')}>
                                <Package width={14} height={14}/> Мои заказы ({allOrders.length})
                            </div>
                            <div className={`${styles.profile_point_2} ${active === 'history' ? styles.active : ''}`}
                                onClick={() => setActive('history')}>
                                <ShoppingBag width={14} height={14}/> История покупок ({purchaseHistory.length})
                            </div>
                        </>
                    )}
                    <div className={`${styles.profile_point} ${active === 'favorites' ? styles.active : ''}`}
                        onClick={() => setActive('favorites')}>
                        <Heart width={14} height={14}/> Избранное
                    </div>
                </div>
                
                {/* Контейнеры контента */}
                {showPrivateSections && active === 'orders' && (
                    <div className={styles.order_list_profile}>
                        {isLoading && <div className={styles.loading}>Загрузка заказов...</div>}
                        {!isLoading && sortedOrders.length === 0 && (
                            <div className={styles.empty}>
                                <p>У вас пока нет заказов</p>
                            </div>
                        )}
                        {!isLoading && sortedOrders.length > 0 && (
                            <div className={styles.orders_container}>
                                <h3>Все заказы</h3>
                                {sortedOrders.map(order => (
                                    <OrderProfileCart 
                                        key={`${order.type}-${order.id}`} 
                                        order={order}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showPrivateSections && active === 'history' && (
                    <div className={styles.order_list_profile}>
                        {isLoading && <div className={styles.loading}>Загрузка истории...</div>}
                        {!isLoading && purchaseHistory.length === 0 && (
                            <div className={styles.empty}>
                                <p>У вас пока нет истории покупок</p>
                            </div>
                        )}
                        {!isLoading && purchaseHistory.length > 0 && (
                            <div className={styles.orders_container}>
                                <h3>История покупок</h3>
                                {purchaseHistory.map(order => (
                                    <HistoryCart 
                                        key={order.id} 
                                        order={order}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {active === 'favorites' && (
                    <div className={styles.favor_list_profile}>
                        <FavoriteCard />
                    </div>
                )}
                
                {!showPrivateSections && active !== 'favorites' && (
                     <div className={styles.order_list_profile}>
                        <p>Для просмотра заказов необходимо войти в этот аккаунт.</p>
                    </div>
                )}
            </div>
        </div>
    );
}