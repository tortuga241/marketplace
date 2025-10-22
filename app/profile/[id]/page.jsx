"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import styles from './styles.module.css';

import BuyerProfile from '../../components/ProfileUser';
import SellerProfile from '../../components/ProfileSeller'; 
import { useParams } from 'next/navigation'; 

export default function ProfilePage() {
    const params = useParams();
    const profileId = params.id; 

    const [hasShop, setHasShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [user, setUser] = useState(null);
    const [shop, setShop] = useState(null); 
    const [userOrders, setUserOrders] = useState([]);
    const [userSales, setUserSales] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);

    const port = "http://localhost:3001"

    // GET запрос на получение заказов и продаж
    const loadProfileOrders = async () => {
        if (!isOwner || !currentUserId) return;
        
        setIsOrdersLoading(true);
        try {
            console.log('Загружаем заказы для пользователя:', currentUserId);
            
            const [purchasesResponse, salesResponse] = await Promise.all([
                axios.get(`${port}/orders/my-purchases`, { withCredentials: true }),
                axios.get(`${port}/orders/my-sales`, { withCredentials: true })
            ]);
            
            console.log('Покупки:', purchasesResponse.data);
            console.log('Продажи:', salesResponse.data);
            
            setUserOrders(purchasesResponse.data || []);
            setUserSales(salesResponse.data || []);
            
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
                // 1. Получение ID текущего пользователя
                const currentUserResponse = await axios.get(`${port}/user/profile`, {withCredentials: true});
                loggedInUserId = currentUserResponse.data.id;
                setCurrentUserId(loggedInUserId);
                console.log('Текущий пользователь ID:', loggedInUserId);
            } catch (error) {
                console.log("Пользователь не залогинен:", error.response?.status);
            }

            try {
                // 2. Получение данных просматриваемого профиля
                const userResponse = await axios.get(`${port}/user/${profileId}`);
                fetchedUser = userResponse.data;
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
    }, [profileId]);

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