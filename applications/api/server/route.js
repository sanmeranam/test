var express = require('express');
var router = express.Router();
var util = require('./util');
var helper = require('./helper');

//router.use(function (req, res, next) {
//    var authToken = req.get("auth-token");
//    var authUser = req.get("auth-user");
//    if (authToken) {
//        req.db.findById(req.tenant.dbname + ".global_config", authToken, function (result) {
//            if (result && result.key === "auth_token") {
//                next();
//            } else {
//                res.json(401, {error: 1, message: "Invalid token."});
//                return;
//            }
//        });
//    } else if (req.path.indexOf("/service")) {
//
//    } else {
//        res.json(401, {error: 1, message: "Unauthorized access."});
//    }
//});

router.post("/service/config/sync", helper.services.syncAccount);
router.post("/service/config/singin", helper.services.signinAccount);
router.post("/service/config/forms", helper.services.syncForms);
router.post("/service/config/cgm_token", helper.services.updateGCMToken);
router.get("/service/config/getprofile", helper.services.getProfileImage);
router.post("/service/config/setprofile", helper.services.updateProfileImage);
router.post("/service/config/getallusers", helper.services.getAllUsers);
router.post("/service/config/onmessage", helper.services.onmessage);

router.post("/service/form/create", helper.services.createForm);
router.post("/service/form/update", helper.services.updateForm);
router.get("/service/form/inbox", helper.services.getInboxForUser);

router.post("/service/file/upload", helper.services.fileUpload);
router.get("/service/file/download", helper.services.fileDownload);


router.post("/service/file/test", helper.services.create);

router.get("/rest/:table", helper.rest.findAll);
router.get("/rest/:table/:id", helper.rest.findById);
router.get("/rest/:table/:key/:value", helper.rest.findByField);
router.put("/rest/:table", helper.rest.create);
router.post("/rest/:table/:id", helper.rest.update);
router.delete("/rest/:table/:id", helper.rest.remove);






module.exports = router;