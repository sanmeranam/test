var events = require('events');

module.exports = function () {
    this.oEventEmitter = new events.EventEmitter()
};

/**
 * Generic
 * @param {type} sEvent
 * @param {type} oData
 * @returns {undefined}
 */
module.exports.prototype.fire = function (sEvent, oData) {
    this.oEventEmitter.emit(sEvent, oData);
};
/**
 * Generic
 * @param {type} sEvent
 * @param {type} callback
 * @returns {undefined}
 */
module.exports.prototype.on = function (sEvent, callback) {
    this.oEventEmitter.on(sEvent, callback);
};

/**
 * Specific to Form Submitted
 * @param {type} oData
 * @returns {undefined}
 */
module.exports.prototype.fireFormSubmitted = function (oData) {
    this.oEventEmitter.emit("FORM_SUBMIT", oData);
};

module.exports.prototype.onFormSubmitted = function (callback) {
    this.oEventEmitter.on("FORM_SUBMIT", callback);
};

module.exports.prototype.fireGotNotif = function (oData) {
    this.oEventEmitter.emit("GOT_NOTIF", oData);
};

module.exports.prototype.onGotNotif = function (callback) {
    this.oEventEmitter.on("GOT_NOTIF", callback);
};