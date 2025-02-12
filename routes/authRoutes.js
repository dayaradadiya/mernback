const authControllers = require('../controllers/authControllers')
const { sellerAuthMiddleware, adminAuthMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router()

router.post('/admin-login',authControllers.admin_login)
// router.get('/get-user', authMiddleware,authControllers.getUser)



router.get('/get-user', (req, res, next) => {
    const adminToken = req.cookies.adminToken;
    const sellerToken = req.cookies.sellerToken;

    if (adminToken) {
        adminAuthMiddleware(req, res, next); // Call admin middleware if admin token exists
    } else if (sellerToken) {
        sellerAuthMiddleware(req, res, next); // Call seller middleware if seller token exists
    } else {
        return res.status(409).json({ error: "Unauthorized: Please login first" });
    }
}, authControllers.getUser);

router.post('/seller-register',authControllers.seller_register)
router.post('/seller-login',authControllers.seller_login)
router.post('/profile-image-upload', sellerAuthMiddleware,authControllers.profile_image_upload)
router.post('/profile-info-add', sellerAuthMiddleware,authControllers.profile_info_add)

// router.get('/logout', authMiddleware,authControllers.logout)


router.get('/logout', (req, res, next) => {
    const adminToken = req.cookies.adminToken;
    const sellerToken = req.cookies.sellerToken;

    if (adminToken) {
        adminAuthMiddleware(req, res, next); // Call admin middleware if admin token exists
    } else if (sellerToken) {
        sellerAuthMiddleware(req, res, next); // Call seller middleware if seller token exists
    } else {
        return res.status(409).json({ error: "Unauthorized: " });
    }
}, authControllers.logout);

module.exports = router

