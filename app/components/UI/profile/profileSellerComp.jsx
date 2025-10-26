"use client"

import styles from './styles/profile.module.css';
import { CheckCircle2, Store, Calendar, MessageSquare, LogOut } from "lucide-react";

import { useApi } from '../../../src/hooks/useApi';

// Принимаем user, shop и isOwner
export default function ProfileSellerComp({ user, shop, isOwner }) {

    const api = useApi();

    // Используем данные из props
    const profileSeller = {
        login: user?.login || "...Загрузка",
        email: user?.email || "...Загрузка"
    };

    const profileShop = {
        type: shop?.type || "...Загрузка",
        createdAt: shop?.createdAt || "...Загрузка",
    };

    const handleLogout = async () => {
        try {
            await api.logout({})
            window.location.href = "/";
        } catch(error) {
            console.error("Ошибка при выходе", error);
            window.location.href = "/"
        }
    };
    
    // Функция для нормальной даты
    const formatJoinDate = (isoDateString) => {
    // ... (логика без изменений)
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

    // Функция для нормального аватара
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
                {/* Скрываем кнопку Выход, если это не владелец аккаунта */}
                {isOwner && (
                    <button onClick={handleLogout} className={styles.but_exit_ps}><LogOut width={17} height={17} />Выход</button>
                )}
            </div>
        </div>
    )
}