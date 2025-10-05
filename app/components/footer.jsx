import styles from './footer.module.css';
import { Star, Facebook, Twitter, Instagram, Youtube, Mail, PhoneCall, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
         <footer className={styles.footer}>
      <div className={styles.container}>
        {/* === ЛОГО И ОПИСАНИЕ === */}
        <div className={styles.section}>
          <div className={styles.logoBlock}>
            <div className={styles.logoCircle}>M</div>
            <span className={styles.logoText}>MarketPlace</span>
          </div>
          <p className={styles.description}>
            Торговая площадка цифровых продуктов, где создатели контента могут
            продавать свои знания и навыки.
          </p>

          <div className={styles.socials}>
            <Facebook />
            <Twitter />
            <Instagram />
            <Youtube />
          </div>
        </div>

        {/* === ДЛЯ ПОКУПАТЕЛЕЙ === */}
        <div className={styles.section}>
          <h4>Для покупателей</h4>
          <ul>
            <li>Как купить товар</li>
            <li>Гарантия качества</li>
            <li>Способы оплаты</li>
            <li>Возврат средств</li>
            <li>Отзывы и рейтинги</li>
          </ul>
        </div>

        {/* === ДЛЯ ПРОДАВЦОВ === */}
        <div className={styles.section}>
          <h4>Для продавцов</h4>
          <ul>
            <li>Как начать продавать</li>
            <li>Комиссии и выплаты</li>
            <li>Продвижение товаров</li>
            <li>Аналитика продаж</li>
            <li>Обучение и ресурсы</li>
          </ul>
        </div>

        {/* === БУДЬТЕ В КУРСЕ === */}
        <div className={styles.section}>
          <h4>Будьте в курсе</h4>
          <p className={styles.newsText}>
            Получайте уведомления о новых товарах и специальных предложениях
          </p>

          <div className={styles.subscribe}>
            <input type="email" placeholder="Email" />
            <button>Подписаться</button>
          </div>

          <div className={styles.contacts}>
            <div>
              <Mail size={16} />
              <span>support@marketplace.ru</span>
            </div>
            <div>
              <PhoneCall size={16} />
              <span>+7 (707) 707-07-07</span>
            </div>
            <div>
              <MessageCircle size={16} />
              <span>Онлайн чат 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* === НИЖНЯЯ ПОЛОСА === */}
      <div className={styles.bottom}>
        <p>© 2025 MarketPlace. Все права защищены.</p>
        <div className={styles.links}>
          <a href="#">Пользовательское соглашение</a>
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Условия использования</a>
        </div>
      </div>
    </footer>
    )
};