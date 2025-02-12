
const paymentController = require('../controllers/payment/paymentController')
const {  adminAuthMiddleware, sellerAuthMiddleware} = require('../middlewares/authMiddleware')
const router = require('express').Router()


router.get('/payment/create-stripe-connect-account',sellerAuthMiddleware,paymentController.create_stripe_connect_account)

router.put('/payment/active-stripe-connect-account/:activeCode',sellerAuthMiddleware,paymentController.active_stripe_connect_account)

router.get('/payment/seller-payment-details/:sellerId',sellerAuthMiddleware,paymentController.get_seller_payment_details)

router.post('/payment/withdrowal-request',sellerAuthMiddleware,paymentController.withdrowal_request)

router.get('/payment/request',adminAuthMiddleware,paymentController.get_payment_request)

router.post('/payment/request-confirm',adminAuthMiddleware,paymentController.payment_request_confirm)

module.exports = router

