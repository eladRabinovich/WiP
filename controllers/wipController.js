'use strict';

function wipController(dao) {

    var express = require('express');
    var router = express.Router();
    var User = require('../models/user');
    var categorySchema = require('../models/category');

    router.post('/postwip', postWip);
    router.post('/postcategory', postCategory);

    router.get('/get-transactionsListByUserName', getTransactionsListByUser);
    router.get('/get-totalCostByCategory', getTotalCostByCategory);
    router.get('/get-totalCost', getTotalCost);

    function postWip(req, res) {
        var usernameID = req.body['usernameID'];
        var categoryID = req.body['categoryID'];
        var cost = req.body['cost'];

        var data = {
            usernameID: usernameID,
            categoryID: categoryID,
            cost: cost
        };
        dao.wip.create(data, onDataCreated);

        function onDataCreated(error, result) {
            if (error || !result) {
                res.status(400).json({'errorMsg':'Unable to update your information.',
                    'status': "failed"});
            } else {
                console.log('success');
                res.json({'status': "success" });
            }
        }
    }

    function postCategory(req, res) {
        var categoryList = req.body['categories'];
        console.log(categoryList);
        dao.category.create(categoryList, function (error, result) {
            if (error || !result)
                res.status(500).send({error: error});
            else if (result.length > 0)
                res.json(result);
        });
    }

    function getTotalCost(req, res) {
        dao.wip.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$cost"
                    }
                }
            }], function (error, result) {
            if (error || !result){
                res.status(500).json({'errorMsg': "failed" });
            } else {
                res.json(result[0].total);
            }
        });
    }

    function getTransactionsListByUser(req, res) {
        var userName = req.body['username'];
        dao.wip.find({ username: userName } , function (error, results){
            if (error || !result) {
                res.status(400).json({'status': "failed" });
            } else {
                console.log(results);
                res.json(results);
            }
        });
    }

    function getTotalCostByCategory(req, res) {
        var category = req.query.category;
        console.log("the category is: " + category);
        dao.wip.aggregate([
            {
                $match : {category : category}
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$cost"
                    }
                }
            } ] , function (error, result) {
            if (error || !result){
                res.status(500).json({'errorMsg': "failed" });
            } else {
                res.json(result[0].total);
            }
        });

    }

    function getSumByCategory(category) {
        dao.wip.aggregate([
            {
                $match : {category : category}
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$cost"
                    }
                }
            } ] , function (error, result) {
            if (error || !result){
                return('undefined')
            } else {
                console.log(result[0].total);
                return(result[0].total);
            }
        });
    }

    function getSumByUserName(username) {
        dao.wip.aggregate([
            {
                $match : {username : username}
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$cost"
                    }
                }
            } ] , function (error, result) {
            if (error || !result){
                return('undefined')
            } else {
                return(result[0].total);
            }
        });
    }

    return router;
}

module.exports = wipController;