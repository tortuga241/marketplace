"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import styles from './styles.module.css';

import BuyerProfile from '../components/ProfileUser'; 
import SellerProfile from '../components/ProfileSeller';

export default function ProfilePage() {
    const [hasShop, setHasShop] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkShopStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3001/shop/my", {
                    withCredentials: true,
                });
                if (response.data) {
                    setHasShop(true);
                } else {
                    setHasShop(false);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setHasShop(false);
                } else {
                    console.error("Error checking shop status:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkShopStatus();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loading_container}>
                <Header />
                <p>Loading profile...</p>
            </div>
        );
    }
    return (
        <div>
            {hasShop ? <SellerProfile /> : <BuyerProfile />}
        </div>
    );
}