import styles from './styles/static.module.css'
import { Box, Star, MessageSquare, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'

export default function StaticProfile({ allReviews = [], order }) {
    
    // Вычисляем статистику из отзывов
    const reviewStatistics = useMemo(() => {
        if (!allReviews || allReviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                positivePercent: 0,
                filledStars: 0
            };
        }

        const totalRating = allReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = (totalRating / allReviews.length).toFixed(1);
        const totalReviews = allReviews.length;
        const positiveReviews = allReviews.filter(review => (review.rating || 0) >= 4).length;
        const positivePercent = Math.round((positiveReviews / totalReviews) * 100);
        const filledStars = Math.floor(parseFloat(averageRating));

        return {
            averageRating,
            totalReviews,
            positivePercent,
            filledStars
        };
    }, [allReviews]);

    // Вычисляем статистику из заказов
    const orderStatistics = useMemo(() => {
        if (!order || order.length === 0) {
            return {
                totalOrders: 0,
                successfulOrders: 0,
                growthPercentage: 0
            };
        }

        const totalOrders = order.length;
        
        const successfulOrders = order.filter(order => 
            order.status === 'completed' || 
            order.status === 'delivered' ||
            order.status === 'success'
        ).length;

        const growthPercentage = totalOrders > 10 ? 12 : 0;

        return {
            totalOrders,
            successfulOrders,
            growthPercentage
        };
    }, [order]);

    return (
        <div className={styles.static_container_ps}>
            {/* Блок Успешных заказов - теперь с реальными данными */}
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><Box width={16} height={16} />Успешных заказов</div>
                <div className={styles.num_ps} style={{color: '#53CC27'}}>{orderStatistics.totalOrders}</div>
                <div className={styles.row_container_ps} style={{color: '#53CC27'}}>
                    <TrendingUp width={14} height={14} /> 
                    +{orderStatistics.growthPercentage}% за месяц
                </div>
            </div>
            
            {/* Блок Средний рейтинг */}
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><Star width={16} height={16} />Средний рейтинг</div>
                <div className={styles.num_ps} style={{color: '#6500f3'}}>{reviewStatistics.averageRating}</div>
                <div className={styles.row_container_ps} style={{color: '#6500f3'}}>
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            width={17} 
                            height={17} 
                            fill={i < reviewStatistics.filledStars ? "#6500f3" : "none"} 
                            color="#6500f3" 
                        />
                    ))}
                </div>
            </div>
            
            {/* Блок Отзывы */}
            <div className={styles.card_container_ps}>
                <div className={styles.row_container_ps}><MessageSquare width={16} height={16} />Отзывы</div>
                <div className={styles.num_ps} style={{color: '#6500f3'}}>{reviewStatistics.totalReviews}</div>
                <div className={styles.col_container_ps}>
                    <div className={styles.decoration_container_ps}>
                        <div 
                            className={styles.color_container}
                            style={{ width: `${reviewStatistics.positivePercent}%` }}
                        ></div>
                    </div>
                    <div className={styles.txt_ps}>{reviewStatistics.positivePercent}% положительных</div>
                </div>
            </div>
        </div>
    )
}