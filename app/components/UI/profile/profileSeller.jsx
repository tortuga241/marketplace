"use client"

import styles from './styles/profile.module.css';
import { useState, useEffect, use } from 'react';
import { CheckCircle2, Store, Calendar, MessageSquare, LogOut } from "lucide-react";
import axios from 'axios';

export default function ProfileSellerComp() {

    const [login, setLogin] = useState(false);
    const [profileSeller, setProfileSeller] = useState({
        login: "...Загрузка",
        email: "...Загрузка"
    });

    const [profileShop, setProfileShop] = useState({
        type: "...Загрузка",
        createdAt: "...Загрузка",
    })

    const port = "http://localhost:3001";

    const handleLogout = async () => {
        try {
            await axios.post(`${port}/user/logout`, {}, {withCredentials: true});
            setLogin(false)
            window.location.href = "/";
        } catch(error) {
            console.error("Ошибка при выходе", error);
            setLogin(false);
            window.location.href = "/"
        }
    };

    //Вывод информации о пользователе
    useEffect(() => {
        const fecthProfileSeller = async () => {
            try {
                const res = await axios.get(`${port}/user/profile`, {withCredentials: true});
                setLogin(true);
                setProfileSeller({
                    login: res.data.login,
                    email: res.data.email,
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setLogin(false);
                } else {
                    console.error("Ошибка при получении профиля:", error);
                    setLogin(false);
                }
            }
        };
        fecthProfileSeller();
    }, [port]);

    useEffect(() => {
        const fetchProfileSellerShop = async () => {
            try {
                const res = await axios.get(`${port}/shop/my`, {withCredentials: true});
                setProfileShop({
                    type: res.data.type,
                    createdAt: res.data.createdAt,
                });
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("Ошибка с запросом");
                } else {
                    console.error("Ошибка при получении магазина:", error)
                }
            }
        };
        fetchProfileSellerShop();
    }, [port]);


    //Функция для нормальной даты
    const formatJoinDate = (isoDateString) => {

    if (!isoDateString || isoDateString.includes("...")) {
        return "...Загрузка";
    }

    const date = new Date(isoDateString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    return date.toLocaleDateString('ru-RU', options);
    };

    //Функция для нормального аватара
    const getAvatarInitial = (login) => {
        if (!login || login.includes("...")) {
            return "";
        }
        return login.charAt(0).toUpperCase();
    };

    return (
        <div className={styles.main_container_ps}>
            <div className={styles.seller_avatar_ps}>{getAvatarInitial(profileSeller.login)}</div>
            <div className={styles.seller_info_ps}>
                <p className={styles.seller_name_ps}>{profileSeller.login}</p>
                <div className={styles.seller_verify_ps}><CheckCircle2 width={15} height={15} /><p className={styles.verify_txt_ps}>Проверенный продавец</p></div>
                <div className={styles.seller_type_ps}><Store width={17} height={17} />Вид деятельности: {profileShop.type}</div>
                <div className={styles.seller_date_ps}><Calendar width={17} height={17} />Продавец с {formatJoinDate(profileShop.createdAt)}</div>
            </div>
            <div className={styles.but_container_ps}>
                <button className={styles.but_mes_ps}><MessageSquare width={16} height={16} /> Связаться</button>
                <button onClick={handleLogout} className={styles.but_exit_ps}><LogOut width={17} height={17} />Выход</button>
            </div>
        </div>
    )
}