const jwt = require('jsonwebtoken');




// module.exports.authMiddleware = async(req,res,next) => {
//     const adminToken = req.cookies.adminToken;
//     const sellerToken = req.cookies.sellerToken;

//     if (!adminToken && !sellerToken) {
//         return res.status(409).json({ error: "Please login first" });
//     }

//     try {
//         let token, decodedToken;

//         if (adminToken) {
//             token = adminToken;
//         } else if (sellerToken) {
//             token = sellerToken;
//         }

//         decodedToken = await jwt.verify(token, process.env.SECRET);
//         req.role = decodedToken.role;
//         req.id = decodedToken.id;

//         next();
//     } catch (error) {
//         return res.status(409).json({ error: "Please login" });
//     }
// };


module.exports.adminAuthMiddleware = async (req, res, next) => {
    const { adminToken } = req.cookies;

    if (!adminToken) {
        return res.status(409).json({ error: "Admin: Please login first" });
    } else {
        try {
            const decodedToken = await jwt.verify(adminToken, process.env.SECRET);
            req.role = decodedToken.role;
            req.id = decodedToken.id;

            next();
        } catch (error) {
            return res.status(409).json({ error: "Admin: Please login" });
        }
    }
};

module.exports.sellerAuthMiddleware = async (req, res, next) => {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
        return res.status(409).json({ error: "Seller: Please login first" });
    } else {
        try {
            const decodedToken = await jwt.verify(sellerToken, process.env.SECRET);
            req.role = decodedToken.role;
            req.id = decodedToken.id;

            next();
        } catch (error) {
            return res.status(409).json({ error: "Seller: Please login" });
        }
    }
};