var nodemailer = require('nodemailer');
var serFile = require("fs");

var emailSerice = function (oConfig) {
    this.transporter = nodemailer.createTransport({
        service: oConfig.email.service,
        auth: {
            user: oConfig.email.user,
            pass: oConfig.email.pass
        }
    });
};

emailSerice.prototype.send = function (from, to, subject, html, callback) {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
    };
    this.transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        if (callback) {
            callback(error, info);
        }
    });
};

emailSerice.prototype.sendRaw = function (options, callback) {
    this.transporter.sendMail(options, function (error, info) {

        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        if (callback) {
            callback(error, info);
        }
    });
};

emailSerice.prototype.sendWithAttch = function (from, to, subject, html, aFiles, callback) {
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html,
        attachments: []
    };
    for (var a in aFiles) {
        mailOptions.attachments.push(aFiles[a]);
    }

    this.transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

        if (callback) {
            callback(error, info);
        }
    });
};


module.exports = function (oConfig) {
    this.oConfig = oConfig;
    this.getInstance = function () {
        return new emailSerice(this.oConfig);
    };
};