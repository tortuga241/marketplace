// import { useMemo } from "react";
// import { 
//     OrdersControllerCompleteResult,
//     OrdersControllerFindMySalesResult,
//     OrdersControllerFindMyPurchasesResult,
//     OrdersControllerFindOneResult,
//     OrdersControllerInitiateResult,
//     OrdersControllerResendResult,
//     LotControllerDeleteOrHideLotByIdResult,
//     LotControllerGetAllLotsResult,
//     LotControllerGetLotByIdResult,
//     LotControllerGetLotsByAccountIdResult,
//     LotControllerLotResult,
//     UserControllerGetProfileByIdResult,
//     UserControllerGetProfileResult,
//     UserControllerLoginResult,
//     UserControllerLogoutResult,
//     UserControllerRequestRegisterResult,
//     UserControllerVerifyRegisterResult,
//     ShopControllerCreateShopResult,
//     ShopControllerGetShopResult,
//     ShopControllerUpdateShopResult,
//     ReviewControllerCreateReviewResult,
//     ReviewControllerDeleteReviewResult,
//     ReviewControllerGetReviewsForLotResult,
//     ReviewControllerGetReviewsForShopResult,   
// } from "../lib/api/client";    

// export const useApi = () => {
//     return useMemo(() => ({
//         // ACCOUNT
//         requestRegister: UserControllerRequestRegisterResult,
//         login: UserControllerLoginResult,
//         logout: UserControllerLogoutResult,
//         verifyRegister: UserControllerVerifyRegisterResult,
//         getProfile: UserControllerGetProfileResult,
//         getProfileById: UserControllerGetProfileByIdResult,

//         // ORDERS
//         completeOrder: OrdersControllerCompleteResult,
//         findMySales: OrdersControllerFindMySalesResult,
//         findMyPurchases: OrdersControllerFindMyPurchasesResult,
//         findOneOrder: OrdersControllerFindOneResult,
//         initiateOrder: OrdersControllerInitiateResult,
//         resendOrder: OrdersControllerResendResult,

//         // LOTS
//         deleteOrHideLot: LotControllerDeleteOrHideLotByIdResult,
//         getAllLots: LotControllerGetAllLotsResult,
//         getLotById: LotControllerGetLotByIdResult,
//         getLotsByAccountId: LotControllerGetLotsByAccountIdResult,
//         createOrUpdateLot: LotControllerLotResult,

//         // SHOPS
//         createShop: ShopControllerCreateShopResult,
//         getShop: ShopControllerGetShopResult,
//         updateShop: ShopControllerUpdateShopResult,

//         // REVIEWS
//         createReview: ReviewControllerCreateReviewResult,
//         deleteReview: ReviewControllerDeleteReviewResult,
//         getReviewsForLot: ReviewControllerGetReviewsForLotResult,
//         getReviewsForShop: ReviewControllerGetReviewsForShopResult,

//     }), []);
// };