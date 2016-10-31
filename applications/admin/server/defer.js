
var Defer = function () {
    this.cb = {};
};

Defer.prototype._done = function (key, data) {
    this.cb[key].d = data;
    this.cb[key].f = true;

    var c = 0, z = 0, result = {};
    for (var m in this.cb) {
        var dd = this.cb[m];
        if (dd.f) {
            z++;
        }
        c++;
        result[dd.n] = dd.d;
    }

    if (c === z) {
        if (this._finish) {
            this._finish(result);
        }
    }
};

Defer.prototype.finish = function (callback) {
    this._finish = callback;
};


Defer.prototype.add = function (name, callback) {
    var that = this;

    var sKey = Math.floor(Math.random() * 99999);
    this.cb[sKey] = {
        k: sKey,
        c: callback,
        f: false,
        d: null,
        n: name
    };


    return (function (data) {
        var d = this.c(data);
        that._done(this.k, d);
    }).bind(this.cb[sKey]);
};





module.exports = Defer;