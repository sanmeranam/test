var express = require('express');
var router = express.Router();


router.get('/:id', function(req, res, next) {
  res.send('api'+req.params.id);
});

module.exports = router;
