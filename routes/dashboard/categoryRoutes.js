
const {  adminAuthMiddleware,sellerAuthMiddleware } = require('../../middlewares/authMiddleware')
const router = require('express').Router()
const categoryController = require('../../controllers/dashboard/categoryController')

router.post('/category-add',adminAuthMiddleware, categoryController.add_category)
// router.get('/category-get',authMiddleware, categoryController.get_category)

router.get('/category-get', (req, res, next) => {
    const adminToken = req.cookies.adminToken;
    const sellerToken = req.cookies.sellerToken;

    if (adminToken) {
        adminAuthMiddleware(req, res, next); // Call admin middleware if admin token exists
    } else if (sellerToken) {
        sellerAuthMiddleware(req, res, next); // Call seller middleware if seller token exists
    } else {
        return res.status(409).json({ error: "Unauthorized: Please login first" });
    }
}, categoryController.get_category);

module.exports = router

