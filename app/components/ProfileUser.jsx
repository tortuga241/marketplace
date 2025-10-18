// "use client"

// import styles from './ProfileUser.module.css';
// import ProfileUser from './UI/profile/profileUser';
// import Header from './Header';
// import { Heart, Package, ShoppingBag } from 'lucide-react';
// import { useState } from 'react';

// //Профиль покупателя и продавца
// import OrderProfileCart from './UI/profile/orderProfile';
// import HistoryCart from './UI/profile/historyBuy';;
// import FavoriteCard from './UI/profile/favor';

// export default function ProfilePage() {

//     const [active, setActive] = useState('orders'); 
//     const [ifShop, setIfShop] = useState(false);
    
//     return (
//         <div className={styles.main_container_profile}>
//             <Header />
//             <div className={styles.container_obert}>
//                 <ProfileUser />
//                 <div className={styles.profile_menu_user}>
//                     <div className={`${styles.profile_point} ${active === 'orders' ? styles.active : ''}`}
//                         onClick={() => setActive('orders')}><Package width={14} height={14}/> Мои заказы</div>
//                     <div className={`${styles.profile_point_2} ${active === 'history' ? styles.active : ''}`}
//                         onClick={() => setActive('history')}><ShoppingBag width={14} height={14}/> История покупок</div>
//                     <div className={`${styles.profile_point} ${active === 'favorites' ? styles.active : ''}`}
//                         onClick={() => setActive('favorites')}><Heart width={14} height={14}/> Избранное</div>
//                 </div>
//                 {/* Контейнеры контента */}
//                 {active === 'orders' && (
//                     <div className={styles.order_list_profile}>
//                         <OrderProfileCart />
//                     </div>
//                 )}

//                 {active === 'history' && (
//                     <div className={styles.order_list_profile}>
//                         <HistoryCart />
//                     </div>
//                 )}

//                 {active === 'favorites' && (
//                     <div className={styles.favor_list_profile}>
//                         <FavoriteCard />
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// };



// components/ProfileUser.js (Компонент логики покупателя)

"use client"

import styles from './ProfileUser.module.css';
import ProfileUserUI from './UI/profile/profileUser'; // Переименовал, чтобы не было путаницы
import Header from './Header';
import { Heart, Package, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

//Профиль покупателя и продавца
import OrderProfileCart from './UI/profile/orderProfile';
import HistoryCart from './UI/profile/historyBuy';;
import FavoriteCard from './UI/profile/favor';


// Принимаем user и isOwner
export default function BuyerProfile({ user, isOwner }) {

    // Устанавливаем вкладку по умолчанию: Заказы (для владельца) или Избранное (для гостя)
    const [active, setActive] = useState(isOwner ? 'orders' : 'favorites'); 
    
    // Если это не владелец, всегда показываем только Избранное (если оно публично)
    useEffect(() => {
        if (!isOwner && active !== 'favorites') {
            setActive('favorites');
        } else if (isOwner && active === 'favorites') {
            setActive('orders');
        }
    }, [isOwner]);
    
    // Приватные разделы
    const showPrivateSections = isOwner; 

    return (
        <div className={styles.main_container_profile}>
            <Header />
            <div className={styles.container_obert}>
                {/* Передаем user и isOwner в UI компонент */}
                <ProfileUserUI user={user} isOwner={isOwner} /> 
                <div className={styles.profile_menu_user}>
                    {/* Скрываем "Мои заказы" и "Историю покупок" для не-владельца */}
                    {showPrivateSections && (
                        <>
                            <div className={`${styles.profile_point} ${active === 'orders' ? styles.active : ''}`}
                                onClick={() => setActive('orders')}><Package width={14} height={14}/> Мои заказы</div>
                            <div className={`${styles.profile_point_2} ${active === 'history' ? styles.active : ''}`}
                                onClick={() => setActive('history')}><ShoppingBag width={14} height={14}/> История покупок</div>
                        </>
                    )}
                    {/* Избранное показываем всегда (или по вашей логике) */}
                    <div className={`${styles.profile_point} ${active === 'favorites' ? styles.active : ''}`}
                        onClick={() => setActive('favorites')}><Heart width={14} height={14}/> Избранное</div>
                </div>
                {/* Контейнеры контента */}
                {/* Показываем приватный контент только владельцу */}
                {showPrivateSections && active === 'orders' && (
                    <div className={styles.order_list_profile}>
                        <OrderProfileCart />
                    </div>
                )}

                {showPrivateSections && active === 'history' && (
                    <div className={styles.order_list_profile}>
                        <HistoryCart />
                    </div>
                )}
                
                {active === 'favorites' && (
                    <div className={styles.favor_list_profile}>
                        <FavoriteCard />
                    </div>
                )}
                
                {/* Сообщение, если гость пытается просмотреть приватный раздел */}
                {!showPrivateSections && active !== 'favorites' && (
                     <div className={styles.order_list_profile}>
                        <p>Для просмотра заказов необходимо войти в этот аккаунт.</p>
                    </div>
                )}
            </div>
        </div>
    )
};