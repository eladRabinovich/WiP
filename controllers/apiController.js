'use strict';

function apiController(dao) {
    var express = require('express');
    var router = express.Router();
    router.post('/postwip', postWip);
    router.get('/get-transactionsListByUserName', getTransactionsListByUser);
    router.get('/get-totalCostByCategory', getTotalCostByCategory);
//    router.get('/get-totalCost', getTotalCost);



    function postWip(req, res) {
        console.log('-----postWip hit.-----');
        //var props = ['username' ,'category', 'cost'];

        var username = req.body['username'];
        var category = req.body['category'];
        var cost = req.body['cost'];

        var data = {
            username: username,
            category: category,
            cost: cost
        };
        console.log(data); // to print only cost for example, we can use data.cost or data["cost"]...
        data["test"]="pass"; // Here what I did is to insert new property to Data from above.. maybe it will work...!
        console.log('-----after foreach.-----');
        console.log(data.test);
        dao.wip.create(data, onDataCreated);

        function onDataCreated(error, result) {
            if (error || !result) {
                res.status(400).json({'errorMsg':'Unable to update your information.',
                    'status': "failed"});
            } else {
                console.log('success');
                res.json({'status': "success" });

                var promise = dao.statistics.findById(dao.SID).exec();
                promise.then(function (result) {
                    result.totalCost = parseFloat(result.totalCost) +  parseFloat(data.cost);
                    result.totalByCategory[data.category] = parseFloat(result.totalByCategory[data.category]) +  parseFloat(data.cost);
                    result.totalByUsername[data.username] = parseFloat(result.totalByUsername[data.username]) +  parseFloat(data.cost);
                    return result.save();
                })
                    .then(function (result) {
                        console.log("Saved" + result);
                    })
                    .catch(function (error) {
                        console.log("Houston we have a problem with SAVE func");
                    });
            }
        }
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
        //console.log(list);

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

module.exports = apiController;