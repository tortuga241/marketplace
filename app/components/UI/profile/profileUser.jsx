"use client"
import { User, LogOut } from 'lucide-react';
import styles from './styles/profileUser.module.css';

import { useApi } from '../../../src/hooks/useApi';

// Принимаем user и isOwner
export default function ProfileUser({ user, isOwner }) {

    const api = useApi();
   
   // Используем данные из props
   const profile = {
        login: user?.login || "...Загрузка",
        email: user?.email || "...Загрузка"
   };
   
   // Выход из аккаунта
    const handleLogout = async () => {
        try {
            await api.logout({}),
            window.location.href = "/"; 
        } catch(error) {
            console.error("Ошибка при выходе", error);
            window.location.href = "/"; 
        }
    };

    // Функция для нормального аватара
    const getAvatarInitial = (login) => {
        if (!login || login.includes("...")) {
            return "";
        }
        return login.charAt(0).toUpperCase();
    };
    
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