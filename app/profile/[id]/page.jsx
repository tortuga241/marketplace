// "use client"

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from '../../components/Header';
// import styles from './styles.module.css';

// import BuyerProfile from '../../components/ProfileUser'; 
// import SellerProfile from '../../components/ProfileSeller';


// export default function ProfilePage() {
//     const [hasShop, setHasShop] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const [user, setUser] = useState(null);
//     const [shop, setShop] = useState(null); 

//     const port = "http://localhost:3001"

//     useEffect(() => {
//         const loadProfileData = async () => {
//             let fetchedUser = null;
//             let fetchedShop = null;

//             try {
//                 const userResponse = await axios.get(`${port}/user/profile`, {withCredentials: true,});
//                 fetchedUser = userResponse.data;
//                 setUser(fetchedUser);  
//             } catch (error) {
//                 console.error("Ошибка при загрузке данные пользователя", error);
//                 setIsLoading(false);
//                 return;
//             }

//             try {
//                 const shopResponse = await axios.get(`${port}/shop/my`, {withCredentials: true});

//                 if (shopResponse.data && shopResponse.data.id) {
//                     fetchedShop = shopResponse.data;
//                     setShop(fetchedShop);
//                 }
                
//             } catch (error) {
//                 if (error.response && error.response.status === 404) {
//                     console.log('Магазин не найден')
//                 } else {
//                     console.error("Ошибка при проверке магазина:", error);
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadProfileData();
//     }, []);


//     useEffect(() => {
//         const checkShopStatus = async () => {
//             try {
//                 const response = await axios.get("http://localhost:3001/shop/my", {
//                     withCredentials: true,
//                 });
//                 if (response.data) {
//                     setHasShop(true);
//                 } else {
//                     setHasShop(false);
//                 }
//             } catch (error) {
//                 if (error.response && error.response.status === 404) {
//                     setHasShop(false);
//                 } else {
//                     console.error("Error checking shop status:", error);
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         checkShopStatus();
//     }, []);

//     if (isLoading) {
//         return (
//             <div className={styles.loading_container}>
//                 <Header />
//                 <p>Loading profile...</p>
//             </div>
//         );
//     }
//     return (
//         <div>
//             {hasShop ? <SellerProfile user={user} shop={shop} /> : <BuyerProfile user={user} />}
//         </div>
//     );
// }





"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import styles from './styles.module.css';

import BuyerProfile from '../../components/ProfileUser'; // Компонент логики Покупателя
import SellerProfile from '../../components/ProfileSeller'; // Компонент логики Продавца
import { useParams } from 'next/navigation'; // Импорт для получения ID из URL

export default function ProfilePage() {
    const params = useParams();
    // 1. Получаем ID профиля из URL
    const profileId = params.id; 

    const [hasShop, setHasShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // 2. Стейт для ID залогиненного пользователя и флага
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null); 

    const port = "http://localhost:3001"

    useEffect(() => {
        if (!profileId) return;

        const loadProfileData = async () => {
            let fetchedUser = null;
            let loggedInUserId = null;

            // 1. Получение ID текущего (залогиненного) пользователя
            try {
                const currentUserResponse = await axios.get(`${port}/user/profile`, {withCredentials: true});
                loggedInUserId = currentUserResponse.data.id;
                setCurrentUserId(loggedInUserId);
            } catch (error) {
                // Пользователь не залогинен (401) или другая ошибка
                console.log("Пользователь не залогинен или ошибка загрузки текущего профиля:", error.response?.status);
            }

            // 2. Получение данных просматриваемого профиля по ID
            try {
                // Эндпоинт /user/:id (который вы предоставили) возвращает user и shop
                const userResponse = await axios.get(`${port}/user/${profileId}`);
                fetchedUser = userResponse.data;
                setUser(fetchedUser);  

                // Проверка магазина
                if (fetchedUser.shop && fetchedUser.shop.id) {
                    setHasShop(true);
                    setShop(fetchedUser.shop);
                } else {
                    setHasShop(false);
                    setShop(null);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных профиля", error);
                // Можно перенаправить на 404
                return;
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [profileId]);

    // 3. Обновление флага владельца
    useEffect(() => {
        if (currentUserId && profileId) {
            setIsOwner(String(currentUserId) === String(profileId));
        } else {
            setIsOwner(false);
        }
    }, [currentUserId, profileId]);


    if (isLoading) {
        return (
            <div className={styles.loading_container}>
                <Header />
                <p>Loading profile...</p>
            </div>
        );
    }
    // Если user === null (например, не найден), можно отобразить ошибку
    if (!user) {
         return (
            <div className={styles.loading_container}>
                <Header />
                <p>Профиль не найден.</p>
            </div>
        );
    }

    // 4. Передача флага isOwner и данных в дочерние компоненты
    return (
        <div>
            {hasShop ? 
                <SellerProfile user={user} shop={shop} isOwner={isOwner} /> 
                : 
                <BuyerProfile user={user} isOwner={isOwner} />
            }
        </div>
    );
}