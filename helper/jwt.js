// import { expressjwt as jwt } from "express-jwt";

// function authjwt(){
//     const secret=process.env.JSON_WEB_TOKEN_SECRET_KEY;
//     return jwt({secret:secret,algorithms:["HS256"]}).unless({
//         path: ["/signup", "/signin"], 
//     });
// }


// export default authjwt;

import { expressjwt as jwt } from "express-jwt";

function authjwt() {
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    return jwt({
        secret: secret,
        algorithms: ["HS256"],
    }).unless({
        path: ["/api/user/signup", "/api/user", "/api/user/signin", "/api/products", "/api/products/featured", "/api/category", "/api/subcat", { url: /^\/uploads\/.*/, methods: ["GET"] }, { url: /^\/api\/product\/\d+$/, methods: ["GET"] },"/api/cart/add","/api/cart" ], // Public routes
    });
}

export default authjwt;
