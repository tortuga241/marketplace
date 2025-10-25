"use client"

import React, { useState } from 'react';
import styles from './styles/modal.module.css'; 
import { X } from 'lucide-react';
import axios from 'axios';

export default function CreateProductModal({ onClose, shopId, accountId, onLotCreated }) {
    
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('video');

    //Состояния для запросов
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const host = process.env.NEXT_PUBLIC_HOST;

    const productTypes = [
        { value: 'video', label: 'Видео' },
        { value: 'document', label: 'Документ' },
        { value: 'article', label: 'Статья' },
        { value: 'code', label: 'Код' },
        { value: 'audio', label: 'Аудио' },
    ];


    //Добавляем новый товар
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log({ title, price, type, description });
        console.log(shopId);
        console.log(accountId);

        setError(null);
        setIsLoading(true);

        const lotData = {
            title,
            description,
            cost: parseFloat(price.replace(/ /g, '')),
            type
        };

        console.log(lotData);

        try {
            const response = await axios.post(`${host}/lots/create`, lotData, {
                headers: {
                    'x-shop-id': shopId,
                    'x-account-id': accountId,
                }
            });

            const newLot = response.data;
            console.log('Лот успешно создан:', newLot);
            
            if (onLotCreated) {
                onLotCreated(newLot);
            }

            onClose();

        } catch (err) {
            let errorMessage = 'Произошла сетевая ошибка';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
            console.error('Ошибка при создании лота:', err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className={styles.modal_backdrop} onClick={onClose}>
            <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                <div className={styles.modal_header}>
                    <h2 className={styles.modal_title}>Добавить новый товар</h2>
                    <button className={styles.modal_close} onClick={onClose} aria-label="Закрыть"><X size={24} /></button>
                </div>
                <p className={styles.modal_subtitle}>Заполните информацию о новом товаре</p>
                <form onSubmit={handleSubmit} className={styles.modal_form}>
                    {/* Поле Название */}
                    <label className={styles.modal_label}>Название</label>
                    <input type="text" placeholder="Название товара" 
                        className={`${styles.modal_input} ${styles.input_active_style}`} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {/* Поле Цена */}
                    <label className={styles.modal_label}>Цена</label>
                    <input type="text" placeholder="1,000 ₸"
                        className={styles.modal_input} 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    {/* Поле Описание */}
                    <label className={styles.modal_label}>Описание</label>
                    <textarea 
                        placeholder="Опишите ваш товар подробно..."
                        className={styles.modal_textarea} 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={6}
                        maxLength={1000}
                    />
                    <div className={styles.char_count}>
                        {description.length}/1000
                    </div>
                    {/* Поле Тип (Select) */}
                    <label className={styles.modal_label}>Тип</label>
                    <div className={styles.modal_select_wrapper}>
                        <select className={`${styles.modal_input} ${styles.modal_select}`}
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            {productTypes.map(pType => (
                                <option key={pType.value} value={pType.value}>
                                    {pType.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Кнопки действий */}
                    <div className={styles.modal_actions}>
                        <button type="button" className={styles.modal_button_cancel} onClick={onClose}>Отмена</button>
                        <button type="submit" className={styles.modal_button_submit}disabled={!title || !price}> Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};