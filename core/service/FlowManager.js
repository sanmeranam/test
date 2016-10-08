var FlowManager = function (formData, db, formDataDb) {
    this.data = formData;
    this.flow = formData.flow;
    this.db = db;
    this.tableName = formDataDb;
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
    this.data.current_action = oAction;
    this.db.updateById('accounts', this.data._id.toString(), this.data, function (data) {});

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





module.exports = FlowManager;