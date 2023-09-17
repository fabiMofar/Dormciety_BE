const express = require('express');
const router = express.Router();


//controllers
const adminSaleArticleController = require('./../../../controllers/version1/admin/admin-saleArticle-controller');

//Middlewares (Validations)
const gate = require('./../../../middlewares/permissions/gate');


router.get(
    '/',
     gate.can('show-saleArticles'),
    adminSaleArticleController.index

);

router.get(
    '/single/:id',
     gate.can('show-saleArticles'),
    adminSaleArticleController.single
);

router.post(
    '/delete/:id' ,
     gate.can('delete-saleArticles'),
    adminSaleArticleController.destroy
);

router.post(
    '/toggle-online/:id' ,
     gate.can('activate-saleArticles'),
    adminSaleArticleController.toggleOnline
);





module.exports = router;
