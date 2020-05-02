const express = require('express');
var router = express.Router();
var dbPool = require('./queries')

//whithout transaction
router.runQuery = function (query) {
    return new Promise(function(resolve, reject) {
        dbPool.query(query).then(
                (version) => resolve(version)
            ).catch((err) => {
                var failMessage = ""
                if (err.message != undefined) {
                    failMessage = err.message;
                } else {
                    failMessage = JSON.stringify(err)
                }
                reject(err)
            })
    })
}


//in transaction
router.runQueryWithTransaction = function (query, client) {
    return new Promise(function (resolve, reject) {
        client.query(query).then(
            (version) => resolve(version)
        ).catch((err) => {
            var failMessage = ""
            if (err.message != undefined) {
                failMessage = err.message;
            } else {
                failMessage = JSON.stringify(err)
            }
            reject(err)
        })
    })
}


module.exports = router;