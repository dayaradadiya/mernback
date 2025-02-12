
const  chatController  = require('../controllers/chat/chatController')
const { adminAuthMiddleware,sellerAuthMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router()


router.post('/chat/customer/add-customer-friend',chatController.add_customer_friend)
router.post('/chat/customer/send-message-to-seller',chatController.customer_message_add)

router.get('/chat/seller/get-customers/:sellerId',chatController.get_customers)
router.get('/chat/seller/get-customer_message/:customerId',sellerAuthMiddleware,chatController.get_customers_seller_message)

router.post('/chat/seller/send-message-to-customer',sellerAuthMiddleware,chatController.seller_message_add)

router.get('/chat/admin/get-sellers',sellerAuthMiddleware,chatController.get_sellers)


// router.post('/chat/message-send-seller-admin',authMiddleware,chatController.seller_admin_message_insert)

router.get('/chat/message-send-seller-admin', (req, res, next) => {
    const adminToken = req.cookies.adminToken;
    const sellerToken = req.cookies.sellerToken;

    if (adminToken) {
        adminAuthMiddleware(req, res, next); // Call admin middleware if admin token exists
    } else if (sellerToken) {
        sellerAuthMiddleware(req, res, next); // Call seller middleware if seller token exists
    } else {
        return res.status(409).json({ error: "Unauthorized: Please login first" });
    }
}, chatController.seller_admin_message_insert);

router.get('/chat/get-admin-messages/:receverId',adminAuthMiddleware,chatController.get_admin_messages)

router.get('/chat/get-seller-messages',sellerAuthMiddleware,chatController.get_seller_messages)


module.exports = router

