"use client"
import axios from 'axios';
import styles from './styles/profileUser.module.css';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from "react"; 

// Принимаем user и isOwner
export default function ProfileUser({ user, isOwner }) {

   const port = process.env.NEXT_PUBLIC_HOST;
   
   // Используем данные из props
   const profile = {
        login: user?.login || "...Загрузка",
        email: user?.email || "...Загрузка"
   };
   
   // Выход из аккаунта
    const handleLogout = async () => {
        try {
            // Вызываем logout и сбрасываем токен в cookies
            await axios.post(`${port}/user/logout`, {}, { withCredentials: true });
            window.location.href = "/"; // Перенаправляем на главную
        } catch(error) {
            console.error("Ошибка при выходе", error);
            window.location.href = "/"; // Перенаправляем даже при ошибке для сброса состояния
        }
    };

    // Функция для нормального аватара
    const getAvatarInitial = (login) => {
        if (!login || login.includes("...")) {
            return "";
        }
        return login.charAt(0).toUpperCase();
    };

    // ВНИМАНИЕ: СТАРАЯ ЛОГИКА useEffect УДАЛЕНА И ЗАМЕНЕНА НА ИСПОЛЬЗОВАНИЕ PROPS
    
    return (
        <section className={styles.profile_container}>
            <div className={styles.avatar_profile}>{getAvatarInitial(profile.login)}</div>
            <div className={styles.user_info}>
                <p className={styles.user_name}>{profile.login}</p>
                <p className={styles.account_status}><User width={13} height={13} /> Пользователь</p>
                <p className={styles.user_email}>{profile.email}</p>
            </div>
            {/* Скрываем кнопку Выход, если это не владелец аккаунта */}
            {isOwner && (
                <button onClick={handleLogout} className={styles.but_logout}><LogOut width={15} height={15} />Выход</button>
            )}
        </section>
    )
}