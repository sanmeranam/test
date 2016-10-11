var GLOBAL = require('../GLOBAL');

var FlowManager = function (formData, tenant) {
    this.data = formData;
    this.flow = formData.flow;
    this.tenant = tenant;
    this.tableName = tenant.dbname + ".form_data";

    if (formData.current_action && formData.current_action.hasOwnProperty('name') && formData.current_action.hasOwnProperty('uid')) {
        this.currentActionData = formData.current_action;

        for (var m in this.flow) {
            var stage = this.flow[m];
            if (this.currentActionData.uid == stage.uid) {
                this.currentAction = stage;
                break;
            }
        }

        if (this.currentAction && this.currentAction._a && this.currentAction._a[this.currentActionData.index]) {
            var cAct = this.currentAction._a[this.currentActionData.index];
            if (this.flow[cAct.r]) {
                var nextAction = this.flow[cAct.r];
                this.data.next_stage = nextAction;
            }
        }

        GLOBAL.db.updateById(this.tableName, this.data._id.toString(), this.data, function (d) {});
    }
};


FlowManager.prototype.hasNextFlow = function () {
    return this.data.hasOwnProperty("next_stage");
};

FlowManager.prototype.processFlow = function () {
    if (this.data.hasOwnProperty("next_stage")) {
        var nextAction = this.data.next_stage;
        if (nextAction)
            this._processNext(nextAction);
    }
};

FlowManager.prototype._processNext = function (oNewAction) {
    if (oNewAction._id)
        delete(oNewAction._id);


    switch (oNewAction._t) {
        case "SMS":
            this._processSMSAction(oNewAction);
            break;
        case "USER":
            this._processUserAction(oNewAction);
            break;
        case "GROUP":
            this._processGroupAction(oNewAction);
            break;
        case "API":
            this._processAPIAction(oNewAction);
            break;
        case "FTP":
            this._processFTPAction(oNewAction);
            break;
        case "NOTIF":
            this._processNotifAction(oNewAction);
            break;
        case "EMAIL":
            this._processEmailAction(oNewAction);
            break;
        case "WALL":
            this._processWALLAction(oNewAction);
            break;
        default:
            this._processCustomAction(oNewAction);
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
    var tenant = that.tenant;

    var fntaskDone = function (err, ok, options) {
        var oFormData = JSON.parse(JSON.stringify(that.data));
        oFormData.stage_history = oFormData.stage_history || [];
        oFormData.stage_history.push({
            type: oAction._t,
            uid: oAction.uid,
            user: 'NA',
            date: Date.now(),
            to: options.to,
            subject: options.subject,
            attach: options.attachments ? options.attachments.length : 0
        });
        oFormData.next_stage = null;
        if (oAction._a && oAction._a.length) {
            oFormData.current_action = {
                name: oAction._a[0].n,
                uid: oAction.uid,
                index: 0
            };
        } else {
            oFormData.current_action = {};
        }
        require('./FormFactory').updateForm(tenant, oFormData);
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
            var label = dd._l ? dd._l.toLowerCase().replace(/\s+/, '_') : '';
            var exp = "[" + label + "]";
            exp = exp.replace("[", "\\[").replace("]", "\\]");
            sText = sText.replace(new RegExp(exp, 'g'), dd._v);
        }
    } catch (E) {
        sText += E.toString();
    }
    return sText;
};


FlowManager.prototype._collectAttachments = function (sTable, formData, callback) {
    var aData = formData.data;
    var ids = [];
    for (var i in aData) {
        var dd = aData[i];
        if (dd && (//dd._t == "audio_record" ||
                //dd._t == "video_record" ||
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
    } else {
        callback([]);
    }
};




module.exports = FlowManager;