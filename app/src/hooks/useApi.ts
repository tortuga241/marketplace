import { useMemo } from "react";
import { getMarketAPI } from "../lib/api/client";    

export const useApi = () => {
  const api = useMemo(() => {
    const marketAPI = getMarketAPI();
    
    return {
      // ACCOUNT
      requestRegister: marketAPI.userControllerRequestRegister,
      login: marketAPI.userControllerLogin,
      logout: marketAPI.userControllerLogout,
      verifyRegister: marketAPI.userControllerVerifyRegister,
      getProfile: marketAPI.userControllerGetProfile,
      getProfileById: marketAPI.userControllerGetProfileById,

      // ORDERS
      completeOrder: marketAPI.ordersControllerComplete,
      findMySales: marketAPI.ordersControllerFindMySales,
      findMyPurchases: marketAPI.ordersControllerFindMyPurchases,
      findOneOrder: marketAPI.ordersControllerFindOne,
      initiateOrder: marketAPI.ordersControllerInitiate,
      resendOrder: marketAPI.ordersControllerResend,

      // LOTS
      deleteOrHideLot: marketAPI.lotControllerDeleteOrHideLotById,
      getAllLots: marketAPI.lotControllerGetAllLots,
      getLotById: marketAPI.lotControllerGetLotById,
      getLotsByAccountId: marketAPI.lotControllerGetLotsByAccountId,
      createOrUpdateLot: marketAPI.lotControllerLot,

      // SHOPS
      createShop: marketAPI.shopControllerCreateShop,
      getShop: marketAPI.shopControllerGetShop,
      updateShop: marketAPI.shopControllerUpdateShop,

      // REVIEWS
      createReview: marketAPI.reviewControllerCreateReview,
      deleteReview: marketAPI.reviewControllerDeleteReview,
      getReviewsForLot: marketAPI.reviewControllerGetReviewsForLot,
      getReviewsForShop: marketAPI.reviewControllerGetReviewsForShop,
    };
  }, []);

  return api;
};