const dashboardController = require('../../controllers/dashboard/dashboardController')
const { adminAuthMiddleware, sellerAuthMiddleware } = require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.get('/admin/get-dashboard-data',adminAuthMiddleware, dashboardController.get_admin_dashboard_data)  
router.get('/seller/get-dashboard-data',sellerAuthMiddleware, dashboardController.get_seller_dashboard_data)  

module.exports = router