"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import styles from './styles.module.css';

import Header from '../../components/Header';
import BuyerProfile from '../../components/ProfileUser';
import SellerProfile from '../../components/ProfileSeller'; 

import { useApi } from '../../src/hooks/useApi';

export default function ProfilePage() {
    const params = useParams();
    const profileId = params.id; 
    const api = useApi();

    const [hasShop, setHasShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null); 
    const [userOrders, setUserOrders] = useState([]);
    const [userSales, setUserSales] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    

    //GET запрос на получение заказов и продаж
    const loadProfileOrders = async () => {
        if (!isOwner || !currentUserId) return;
        
        setIsOrdersLoading(true);
        try {
            console.log('Загружаем заказы для пользователя:', currentUserId);
            
            const [purchases, sales] = await Promise.all([
                api.findMyPurchases(),
                api.findMySales()
            ]);
            
            console.log('Покупки успешно выведены');
            console.log('Продажи успешно');
            
            setUserOrders(purchases || []);
            setUserSales(sales || []);
            
        } catch (error) {
            console.error("Ошибка при загрузке заказов профиля:", error);
            console.error("Статус ошибки:", error.response?.status);
            console.error("Данные ошибки:", error.response?.data);
            setUserOrders([]);
            setUserSales([]);
        } finally {
            setIsOrdersLoading(false);
        }
    };

    // Основная загрузка профиля
    useEffect(() => {
        if (!profileId) return;

        const loadProfileData = async () => {
            let fetchedUser = null;
            let loggedInUserId = null;

            try {
                //Получение ID текущего пользователя
                const currentUser = await api.getProfile();
                setCurrentUserId(currentUser.id);
                console.log('Текущий пользователь ID:', currentUser.id);
            } catch (error) {
                console.log("Пользователь не авторизован");
                setCurrentUserId(null);
            }

            try {
                //Получение данных просматриваемого профиля
                const fetchedUser = await api.getProfileById(profileId);
                setUser(fetchedUser);  
                console.log('Загруженный пользователь:', fetchedUser);

                // Проверка магазина
                if (fetchedUser.shop && fetchedUser.shop.id) {
                    setHasShop(true);
                    setShop(fetchedUser.shop);
                    console.log('У пользователя есть магазин:', fetchedUser.shop);
                } else {
                    setHasShop(false);
                    setShop(null);
                    console.log('У пользователя нет магазина');
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных профиля", error);
                return;
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [profileId, api]);

    // Загрузка заказов когда определен владелец
    useEffect(() => {
        if (currentUserId && profileId) {
            const owner = String(currentUserId) === String(profileId);
            setIsOwner(owner);
            console.log('Setting isOwner to:', owner);
        } else {
            setIsOwner(false);
        }
    }, [currentUserId, profileId]);

    // 
    useEffect(() => {
        if (isOwner) {
            console.log('isOwner state is now true, loading orders...');
            loadProfileOrders();
        }
    }, [isOwner]);

    if (isLoading) {
        return (
            <div className={styles.loading_container}>
                <Header />
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.loading_container}>
                <Header />
                <p>Профиль не найден.</p>
            </div>
        );
    }

    // Подготавливаем данные для передачи
    const profileData = {
        user,
        isOwner,
        orders: userOrders,
        sales: userSales,
        isLoading: isOrdersLoading,
        onRefreshOrders: loadProfileOrders
    };

    const sellerProfileData = {
        ...profileData,
        shop
    };

    console.log('Передаваемые данные в профиль:', profileData);

    return (
        <div>
            {hasShop ? 
                <SellerProfile {...sellerProfileData} /> 
                : 
                <BuyerProfile {...profileData} />
            }
        </div>
    );
}