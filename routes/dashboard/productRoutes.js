const productController = require('../../controllers/dashboard/productController') 
const { authMiddleware, sellerAuthMiddleware } = require('../../middlewares/authMiddleware')
const router = require('express').Router()

router.post('/product-add',sellerAuthMiddleware, productController.add_product)  
router.get('/products-get',sellerAuthMiddleware, productController.products_get)  
router.get('/product-get/:productId',sellerAuthMiddleware, productController.product_get)
router.post('/product-update',sellerAuthMiddleware, productController.product_update) 
router.post('/product-image-update',sellerAuthMiddleware, productController.product_image_update)   
            
module.exports = router