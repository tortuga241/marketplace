"use client"

import React, { useState } from 'react';
import styles from './styles/modal.module.css'; 
import { X } from 'lucide-react';

import { useApi } from '../../../src/hooks/useApi';

export default function CreateProductModal({ onClose, shopId, accountId, onLotCreated }) {
    
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('video');

    //Состояния для запросов
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const api = useApi();

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
        console.log('Shop ID:', shopId);
        console.log('Account ID:', accountId);

        console.log("Тип данных shopId:", typeof shopId);

        setError(null);
        setIsLoading(true);

        const lotData = {
            title,
            description,
            cost: price.replace(/ /g, ''),
            type
        };

        console.log('Данные для создания лота:', lotData);

        try {
            
            const response = await api.createOrUpdateLot(lotData, {
                headers: {
                    "x-shop-id": shopId,
                    "x-account-id": accountId,
                }
            });

            const newLot = response;
            console.log('Лот успешно создан:', newLot);
            
            if (onLotCreated) {
                onLotCreated(newLot);
            }

            onClose();

        } catch (err) {
            console.error('Ошибка при создании лота:', err);
            
            let errorMessage = 'Произошла ошибка при создании товара';
            
            if (err.response?.status === 400) {
                errorMessage = 'Не переданы обязательные заголовки x-shop-id или x-account-id';
            } else if (err.response?.status === 401) {
                errorMessage = 'Ошибка авторизации (магазин/аккаунт не найден или не является владельцем)';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
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