
const { authMiddleware, adminAuthMiddleware, sellerAuthMiddleware } = require('../../middlewares/authMiddleware')
const router = require('express').Router()
const sellerController = require('../../controllers/dashboard/sellerController')

router.get('/request-seller-get',sellerAuthMiddleware, sellerController.request_seller_get)
router.get('/get-seller/:sellerId',sellerAuthMiddleware, sellerController.get_seller)
router.post('/seller-status-update',sellerAuthMiddleware, sellerController.seller_status_update)

router.get('/get-sellers',sellerAuthMiddleware, sellerController.get_active_sellers)

router.get('/get-deactive-sellers',sellerAuthMiddleware,sellerController.get_deactive_sellers)

module.exports = router

