"use client";

import { Search, Bell, User, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import styles from './Header.module.css';
import Link from "next/link";
import axios from "axios";

export default function Header() {
  const [login, setLogin] = useState(false);
  const port = 'http://localhost:3001';


  //Проверка на авторизацию пользователя
  useEffect(() => {
    const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${port}/user/profile`, { withCredentials: true });

      if (res.status === 200 && res.data) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
          setLogin(false);
        } else {
          console.error("Ошибка при проверке статуса сессии:", error);
          setLogin(false);
        }
      }
    }
    checkAuthStatus();
  }, [port])


  return (
    <header className={styles.header_main}>
      <Link href="/"> <div className={styles.header_logo}>
        <div className={styles.m}>M</div>
        <div className={styles.title_header}>MarketPlace</div>
      </div></Link>

      <div className={styles.input_search}>
        <button className={styles.icon_button} onClick={() => document.querySelector(`.${styles.input_header}`).focus()}>
          <Search className={styles.icon_search} width={17} height={17} />
        </button>
        <input
          className={styles.input_header}
          type="text"
          placeholder="Поиск документов, статей, видео..."
        />
      </div>

      <div className={styles.row_container_header}>
        <Link href='/catalog'><p className={styles.menu_header_txt}>Каталог</p></Link>
        <p className={styles.menu_header_txt}>Продавцы</p>
        <p className={styles.menu_header_txt}>Как продавать</p>
      </div>

      <div className={styles.icon_header}>
        <Bell className={styles.icon_header_bell} width={15} height={15} />
        <ShoppingCart className={styles.icon_header_bascket} width={15} height={15} />
      </div>

      <div className={styles.but_header}>
        {login ? (
          <>
            <Link href="/profile">
              <button className={styles.but_singin}>
                <User width={15} height={15} /> Личный Кабинет
              </button>
              {/* onClick={handleLogout}  Выйти можно будет через линый кабинет */}
            </Link>
            <Link href="/become-seller"><button className={styles.but_sale}>
              Начать продавать
              {/* Магазин  Если пользователь вошел в аккаунт и открыл свой "магазин", показывать ему эту кнопку */}
            </button></Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <button className={styles.but_singin}>
                <User width={15} height={15} /> Войти
              </button>
            </Link>
            <Link href="/register"><button className={styles.but_sale}>Начать продавать</button></Link>
          </>
        )}
      </div>
    </header>
  );
}
