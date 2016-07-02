var fs = require('fs');

module.exports = {
    createResponse: function (bSuccess, data) {
        return {
            status: bSuccess ? "OK" : "ERROR",
            message: data
        };
    },
    getNgControllerFiles: function (callback) {
        fs.readdir(__dirname + "/../client/controller/", function (err, items) {
            var aFiles = [];
            for (var i = 0; i < items.length; i++) {
                var file = '/_self/controller/' + items[i];
                aFiles.push(file);
            }
            callback(aFiles);
        });
    }
};