var GLOBAL = require('../GLOBAL');

var FlowManager = function (formData, tenant) {
    this.data = formData;
    this.flow = formData.flow;
    this.tenant = tenant;
    this.tableName = tenant.dbname + ".form_data";
    this.lastActiondata = formData.last_action;

    for (var m in this.flow) {
        var stage = this.flow[m];
        if (this.lastActiondata.uid == stage.uid) {
            this.lastAction = stage;
            break;
        }
    }

};


FlowManager.prototype.hasNextFlow = function () {
    try {
        var cAct = this.lastAction._a[this.lastActiondata.index];
        if (this.flow[cAct.r]) {
            return true;
        }
    } catch (e) {
    }
    return false;
};

FlowManager.prototype.processFlow = function () {
    if (this.lastAction && this.lastActiondata) {
        var cAct = this.lastAction._a[this.lastActiondata.index];
        if (this.flow[cAct.r]) {
            var nextAction = this.flow[cAct.r];
            this._processNext(nextAction);
        }
    }
};

FlowManager.prototype._processNext = function (oAction) {
    delete(oAction._id);
    this.data.current_action = oAction;
    GLOBAL.db.updateById(this.tableName, this.data._id.toString(), this.data, function (data) {

    });

    switch (oAction._t) {
        case "SMS":
            this._processSMSAction(oAction);
            break;
        case "USER":
            this._processUserAction(oAction);
            break;
        case "GROUP":
            this._processGroupAction(oAction);
            break;
        case "API":
            this._processAPIAction(oAction);
            break;
        case "FTP":
            this._processFTPAction(oAction);
            break;
        case "NOTIF":
            this._processNotifAction(oAction);
            break;
        case "EMAIL":
            this._processEmailAction(oAction);
            break;
        case "WALL":
            this._processWALLAction(oAction);
            break;
        default:
            this._processCustomAction(oAction);
    }

};

FlowManager.prototype._processSMSAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processEmailAction = function (oAction) {
    var cc = oAction._f.cc.value;
    var tempalte = oAction._f.template.value;
    var bIncludeAttach = new Boolean(oAction._f.inclue_attach.value);
    var that = this;

    var oEmail = GLOBAL.EmailService.getInstance();

    var tableName = this.tenant.dbname + ".template_factory";

    var fntaskDone = function () {

    };



    GLOBAL.db.findById(tableName, tempalte, function (data) {
        if (data) {
            var to = data.to.split(",");
            var subject = that._compileData(data.subject, that.data);
            var html = that._compileData(data.body, that.data);

            if (bIncludeAttach) {
                that._collectAttachments(that.tenant.dbname + ".file_entry", that.data, function (attach) {
                    oEmail.sendRaw({
                        to: to,
                        subject: subject,
                        html: html,
                        cc: cc,
                        attachments: attach
                    }, fntaskDone);

                });

            } else {
                oEmail.sendRaw({
                    to: to,
                    subject: subject,
                    html: html,
                    cc: cc
                }, fntaskDone);
            }
        }
    });

    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processUserAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processGroupAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processFTPAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processWALLAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processNotifAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processAPIAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};

FlowManager.prototype._processCustomAction = function (oAction) {
    /**
     * collect template
     * fill template
     * create sms server connection
     * send sms
     */
};


FlowManager.prototype._compileData = function (sText, formData) {
    try {
        var aData = formData.data;
        for (var i in aData) {
            var dd = aData[i];
            var label=dd._l?dd._l.toLowerCase().replace(/\s+/,'_'):'';
            var exp = "[" + label + "]";
            if (sText.indexOf(exp) > -1) {
                sText = sText.split(exp).join(dd._v);
            }
        }
    } catch (E) {
    }
    return sText;
};


FlowManager.prototype._collectAttachments = function (sTable, formData, callback) {
    var aData = formData.data;
    var ids = [];
    for (var i in aData) {
        var dd = aData[i];
        if (dd && (dd._t == "audio_record" ||
                dd._t == "video_record" ||
                dd._t == "sign_input" ||
                dd._t == "file_attach" ||
                dd._t == "photo_attach")) {
            
            if (dd._v) {
                if (dd._v.indexOf("|") > -1) {
                    ids = ids.concat(dd._v.split("|"));
                } else {
                    ids.push(dd._v);
                }
            }
        }
    }
    if (ids.length) {
        GLOBAL.db.findByIds(sTable, ids, function (result) {
            result = result.map(function (v) {
                return {path: v.path};
            });
            callback(result);
        });
    }
};




module.exports = FlowManager;