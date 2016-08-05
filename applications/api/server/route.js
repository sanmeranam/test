var express = require('express');
var router = express.Router();
var util = require('./util');
var helper = require('./helper');

router.use(function (req, res, next) {
    var authToken = req.get("auth-token");
    var authUser = req.get("auth-user");
    if (authToken) {
        req.db.findById("auth_token", authToken, function (result) {
            if (result) {
                next();
                result.history.push({
                    date: Date.now(),
                    path: req.path,
                    mothod: req.method,
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    user: authUser || ""
                });
                req.db.updateById("auth_token", result._id, result);
            } else {
                res.json(401, {error: 1, message: "Invalid token."});
                return;
            }
        });
    } else {
        res.json(401, {error: 1, message: "Unauthorized access."});
    }
});

router.get("/rest/:table", helper.rest.findAll);
router.get("/rest/:table/:id", helper.rest.findById);
router.get("/rest/:table/:key/:value", helper.rest.findByField);
router.put("/rest/:table", helper.rest.create);
router.post("/rest/:table/:id", helper.rest.update);
router.delete("/rest/:table/:id", helper.rest.remove);



module.exports = router;