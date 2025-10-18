import { Star, Download, Eye, Heart } from 'lucide-react';
import styles from './styles/product.module.css';

export default function ProductCart() {
  const products = [
    {
      id: 1,
      title: "Полное руководство по веб-дизайну 2024",
      description: "Комплексный курс по современному веб-дизайну с практическими примерами",
      price: "60,999 тг",
      originalPrice: "73,999 тг",
      rating: 4.9,
      reviews: 127,
      downloads: 1203,
      views: 5420,
      category: "Дизайн",
      author: "Анна Иванова",
      authorAvatar: "AI",
      isNew: true,
      isBestseller: true,
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Шаблоны бизнес-планов для стартапов",
      description: "25 готовых шаблонов бизнес-планов с подробными инструкциями",
      price: "41,999 тг",
      rating: 4.7,
      reviews: 89,
      downloads: 856,
      views: 3210,
      category: "Бизнес",
      author: "Михаил Петров",
      authorAvatar: "МП",
      isBestseller: true,
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Python анализ данных - Практика",
      description: "Изучите Python и библиотеки для анализа данных на реальных проектах",
      price: "53,499 тг",
      rating: 4.8,
      reviews: 203,
      downloads: 1876,
      views: 8950,
      category: "Программирование",
      author: "Елена Сидорова",
      authorAvatar: "ЕС",
      isNew: true,
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop"
    }
  ];

  return (
    <>
      {products.map((product) => (
        <div key={product.id} className={styles.main_container_cart_product}>
          {/* Картинка */}
          <div className={styles.image_cart_production}>
            <img src={product.thumbnail} alt={product.title} />

            {/* Бейджи */}
            <div className={styles.badges}>
              {product.isNew && <span className={styles.badgeNew}>Новинка</span>}
              {product.isBestseller && <span className={styles.badgeBest}>Хит продаж</span>}
            </div>

            {/* Счетчики */}
            <div className={styles.meta}>
              <span><Eye size={16}/> {product.views}</span>
              <span><Download size={16}/> {product.downloads}</span>
            </div>

            {/* Сердечко при hover */}
            <button className={styles.heartBtn}>
              <Heart size={20}/>
            </button>
          </div>

          {/* Контент */}
          <div className={styles.content}>
            <span className={styles.category}>{product.category}</span>
            <h3 className={styles.title}>{product.title}</h3>
            <p className={styles.desc}>{product.description}</p>
            
            <div className={styles.author}>
              <div className={styles.avatar}>{product.authorAvatar}</div>
              <span>{product.author}</span>
            </div>

            <div className={styles.rating}>
              <Star size={16} color="gold"/> {product.rating} <span>({product.reviews} отзывов)</span>
            </div>

            <div className={styles.footer}>
              <div className={styles.price}>
                <span className={styles.newPrice}>{product.price}</span>
                {product.originalPrice && <span className={styles.oldPrice}>{product.originalPrice}</span>}
              </div>
              <button className={styles.buyBtn}>Купить</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
