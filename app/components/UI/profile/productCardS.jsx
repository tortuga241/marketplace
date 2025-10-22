import styles from './styles/cardProductS.module.css';
import { Star, Trash2 } from 'lucide-react';

export default function ProductCardS({ lots, isOwner, onDelete, onHide }) {

    const handleDeleteClick = (lotId) => {
        if (onDelete) {
            onDelete(lotId);
        }
    };
    
    return (
        <>
        {lots.map((lot) => (
            <div key={lot.id} className={styles.main_container_card_cps}>
            <div className={styles.col_container_cps}>
                <div className={styles.row_container_cps}>
                    <p className={styles.title_card_cps}>{lot.title}</p>
                    <div className={styles.type_card_cps}>{lot.type}</div>
                </div>
            </div>
            <div className={styles.icon_reviw_cps}><Star width={15} height={15} fill='#6500f3' color='#6500f3' />{lot.reviews}</div>
            <div className={styles.col_container_cps}>
                <div className={styles.row_container_cps}>
                    <div className={styles.cost_cps}>{lot.cost}₸</div>
                </div>
                <div className={styles.row_container_cps}>
                    <button className={styles.buy_but_cps} style={{flexGrow: "1"}}>Купить</button>
                    {isOwner && (
                        <button onClick={() => handleDeleteClick(lot.id)} className={styles.delete_cps} style={{marginLeft: "5px"}}><Trash2 width={16} height={16} /></button>
                    )}
                </div>
            </div>
        </div>
        ))}
        </>
    )
}