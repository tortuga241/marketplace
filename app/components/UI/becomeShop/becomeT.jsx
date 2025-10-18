"use client"

import styles from './style/becomeT.module.css';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

export default function BecomeT({ onBack, onSubmit, onChange, formData}) {
    const [phone, setPhone] = useState('');

    const handleFinish = () => {
        onChange("phone", phone);
        onSubmit();
    };

    return (
        <section className={styles.main_container_t}>
             <div className={styles.title_t}>
                <h3 className={styles.title_become_t}>Контактные данные</h3>
                <p className={styles.title_txt_t}>Как с вами связаться?</p>
            </div>
            <div className={styles.input_container}>
                <p className={styles.phonenum}>Номер телефона:</p>
                <input type="text" placeholder='+ 7 (777) 123 45 67' className={styles.input_t} value={phone} onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div className={styles.data_t}>
                <p className={styles.data_title}>Проверьте данные:</p>
                <div className={styles.col_container_t}>
                    <div className={styles.row_container}>Тип: {formData.type}</div>
                    <div className={styles.row_container}>Категория: {formData.category}</div>
                    <div className={styles.row_container}>Описание: {formData.description}</div>
                </div>
            </div>
            <div className={styles.row_container_t}>
                <button onClick={onBack} className={styles.but_f}><ArrowLeft width={16} height={16} />Назад</button>
                <button onClick={handleFinish} className={styles.but_t}>Отправить заявку <CheckCircle2 width={16} height={16} /></button>
            </div>
        </section>
    )
}