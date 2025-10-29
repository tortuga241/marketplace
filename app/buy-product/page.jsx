'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

import QRCodeGenerator from '../components/UI/buyProduct/qr';

import { useApi } from '../src/hooks/useApi';

export default function BuyProduct() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const api = useApi();

    const [currentStep, setCurrentStep] = useState(1); 
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [canResend, setCanResend] = useState(true);
    const [resendText, setResendText] = useState('Отправить код повторно');
    const [verificationId, setVerificationId] = useState(null);
    const [codeError, setCodeError] = useState(null);
    const [product, setProduct] = useState(null);

    const inputRefs = useRef([]);
    const totalSteps = 3;

    const lotId = searchParams.get('lotId');
    console.log("Lot id:",lotId);

    // Получаем email пользователя (в реальном приложении из контекста/стора)
    const userEmail = 'example@gmail.com';

    // Загрузка данных о продукте при получении lotId
    useEffect(() => {
        const id = searchParams.get('lotId');
        console.log("Lot id:", id);
        console.log("Тип lotId:", typeof id);
        
        if (id && id !== 'null' && id !== 'undefined') {
            fetchProductData(id);
        } else {
            setError('ID товара не указан');
        }
    }, [searchParams]);

    // Функция загрузки данных о продукте
    const fetchProductData = async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Загружаем данные для лота:', id);
            console.log('Тип id в функции:', typeof id);
            
            // Явно преобразуем к строке на всякий случай
            const stringId = String(id);
            console.log('ID после преобразования:', stringId);
            
            const response = await api.getLotById(stringId);
            console.log('Полный ответ:', response);
            console.log('Данные о товаре получены:', response.title);
            setProduct(response);
        } catch (err) {
            console.error('Ошибка при загрузке данных о товаре:', err);
            console.error('Детали ошибки:', err.response?.data);
            setError('Не удалось загрузить информацию о товаре');
        } finally {
            setIsLoading(false);
        }
    };

    // Обновление прогресс-бара
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    // Обработка ввода кода
    const handleCodeInput = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setCodeError(null); // Сбрасываем ошибку при новом вводе

        // Автопереход к следующему полю
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Обработка Backspace
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Вставка из буфера обмена
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        const newCode = [...code];
        
        pasteData.split('').forEach((char, i) => {
            if (/^\d$/.test(char) && i < 6) {
                newCode[i] = char;
            }
        });
        
        setCode(newCode);
        setCodeError(null);
        
        // Фокус на последнее заполненное поле
        const lastFilledIndex = newCode.findIndex(val => val === '');
        const focusIndex = lastFilledIndex === -1 ? 5 : Math.min(lastFilledIndex, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    // Проверка заполненности кода
    const isCodeComplete = code.every(digit => digit !== '');

    // Функция отправки кода на почту (инициирование покупки)
    const initiatePurchase = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Инициирование покупки...');
            
            const response = await api.initiateOrder({ lotId: product.id })
            
            const data = response;
            console.log('Ответ от сервера:', data);

            setVerificationId(data.verificationId);
            setSuccess('Код подтверждения отправлен на вашу почту!');
            
            // Блокируем повторную отправку на 30 секунд
            setCanResend(false);
            setResendText('Код отправлен!');
            setTimeout(() => {
                setCanResend(true);
                setResendText('Отправить код повторно');
            }, 30000);

        } catch (err) {
            console.error('Ошибка при инициировании покупки:', err);
            
            if (err.response?.status === 401) {
                setError('Требуется авторизация. Пожалуйста, войдите в систему.');
            } else {
                setError(err.response?.data?.message || err.message || 'Произошла ошибка при отправке кода');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Функция отправки кода повторно
    const handleResendCode = async () => {
        if (!canResend || !verificationId) return;

        setIsLoading(true);
        setError(null);

        try {

            await api.resendOrder({ verificationId: verificationId })

            setSuccess('Код отправлен повторно!');
            setCanResend(false);
            setResendText('Код отправлен!');

            // Сброс через 30 секунд
            setTimeout(() => {
                setCanResend(true);
                setResendText('Отправить код повторно');
            }, 30000);

        } catch (err) {
            console.error('Ошибка при повторной отправке кода:', err);
            setError(err.response?.data?.message || err.message || 'Ошибка при отправке кода');
        } finally {
            setIsLoading(false);
        }
    };

    // Функция проверки кода и завершения покупки
    const verifyCodeAndComplete = async () => {
        if (!isCodeComplete || !verificationId) return;

        setIsLoading(true);
        setCodeError(null);
        setError(null);

        try {
            const verificationCode = code.join('');
        
            const response = await api.completeOrder({ verificationId: verificationId, code: verificationCode })

            console.log('Покупка завершена успешно:', response);
            setSuccess('Покупка успешно завершена!');
            
            // Переходим к следующему шагу
            setCurrentStep(3);

        } catch (err) {
            console.error('Ошибка при проверке кода:', err);
            
            if (err.response?.status === 400) {
                setCodeError('Неверный код подтверждения. Проверьте код и попробуйте снова.');
            } else {
                setCodeError(err.response?.data?.message || err.message || 'Ошибка при проверке кода');
            }
            
            // Сбрасываем код для повторного ввода
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    // Функция финального завершения заказа
    const finalizeOrder = async () => {
        console.log('Заказ окончательно оформлен');
        setSuccess('Заказ успешно оформлен!');
    };

    const handleClick = () => {
        window.location.href = "/";
    }

    // Навигация между шагами
    const nextStep = async () => {
        if (currentStep < totalSteps) {
            // При переходе с шага 1 на шаг 2 отправляем код на почту
            if (currentStep === 1) {
                await initiatePurchase();
                if (!error) {
                    setCurrentStep(prev => prev + 1);
                }
            } 
            // При переходе с шага 2 на шаг 3 проверяем код
            else if (currentStep === 2) {
                await verifyCodeAndComplete();
                // Переход на шаг 3 происходит внутри verifyCodeAndComplete при успехе
            }
            // При переходе с шага 3 завершаем заказ
            else if (currentStep === 3) {
                await finalizeOrder();
            }
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setCodeError(null);
            setError(null);
            setSuccess(null);
        }
    };

    // Рендер шагов прогресса
    const renderSteps = () => {
        return Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <div
                key={step}
                className={`${styles.step} ${
                    step < currentStep 
                        ? styles.completed 
                        : step === currentStep 
                        ? styles.active 
                        : ''
                }`}
            >
                {step < currentStep ? '✓' : step}
            </div>
        ));
    };

    // Рендер контента для текущего шага
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Информация о заказе
                return (
                    <div className={styles.step_content}>
                        <h2>Детали заказа</h2>
                        <p className={styles.subtitle}>Проверьте детали заказа</p>
                        <div className={styles.order_moments}>
                            <p className={styles.order_moment_p}>Товар: {product?.title || 'Не указан'}</p>
                            <p className={styles.order_moment_p}>Цена: {product?.cost || '0'}₸</p>
                            <p className={styles.order_moment_p}>Продавец: {product?.shop?.owner?.login || 'Не указан'}</p>
                        </div>
                        
                        {error && <div className={styles.error_message}>{error}</div>}
                        {success && <div className={styles.success_message}>{success}</div>}

                        <div className={styles.buttons}>
                            <button 
                                className={styles.btn_back} 
                                onClick={previousStep} 
                                disabled={currentStep === 1 || isLoading}
                            >
                                Назад
                            </button>
                            <button 
                                className={styles.btn_next} 
                                onClick={nextStep}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Отправка...' : 'Далее →'}
                            </button>
                        </div>
                    </div>
                );
            
            case 2: // Подтверждение email
                return (
                    <div className={styles.step_content}>
                        <h2>Подтверждение Email</h2>
                        <p className={styles.subtitle}>
                            Код отправлен на: <span className={styles.email_highlight}>{userEmail}</span>
                        </p>
                        <p className={styles.subtitle}>
                            Введите 6-значный код из письма для подтверждения покупки
                        </p>

                        <div className={styles.code_inputs}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    className={`${styles.code_input} ${digit ? styles.filled : ''} ${codeError ? styles.error : ''}`}
                                    value={digit}
                                    maxLength={1}
                                    onChange={(e) => handleCodeInput(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        <div className={styles.resend_link}>
                            <button 
                                onClick={handleResendCode}
                                disabled={!canResend || isLoading}
                                className={canResend ? '' : styles.disabled}
                            >
                                {isLoading ? 'Отправка...' : resendText}
                            </button>
                        </div>

                        <div className={styles.buttons}>
                            <button 
                                className={styles.btn_back} 
                                onClick={previousStep}
                                disabled={isLoading}
                            >
                                Назад
                            </button>
                            <button 
                                className={styles.btn_next} 
                                onClick={nextStep}
                                disabled={!isCodeComplete || isLoading}
                            >
                                {isLoading ? 'Проверка...' : 'Далее →'}
                            </button>
                        </div>
                    </div>
                );
            
            case 3: // Оплата и завершение
                return (
                    <div className={styles.step_content}>
                        <h2>Способ оплаты</h2>
                        <div className={styles.subtitle}>
                            <QRCodeGenerator />
                        </div>
                        
                        {success && <div className={styles.success_message}>{success}</div>}

                        <div className={styles.buttons}>
                            <button 
                                className={styles.btn_back} 
                                onClick={previousStep}
                                disabled={isLoading}
                            >
                                Назад
                            </button>
                            <button 
                                className={styles.btn_next} 
                                onClick={handleClick}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Завершение...' : 'Завершить заказ'}
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.main_buy_product}>
            <div className={styles.obertka_container}>
                <div className={styles.progress_container}>
                    <div className={styles.progress_line}></div>
                    <div 
                        className={styles.progress_fill} 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                    {renderSteps()}
                </div>

                {renderStepContent()}
            </div>
        </div>
    );
    {codeError && <div className={styles.error_message}>{codeError}</div>}
    {error && <div className={styles.error_message}>{error}</div>}
    {success && <div className={styles.success_message}>{success}</div>}
}