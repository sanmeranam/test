/**
 * @constructor
 * @param {type} oConfig
 * @returns {ChartHelper}
 */
function ChartHelper(oConfig) {
    this.oConfig = oConfig;
    this.clear();
    this._selectionColor = "#FFB400";
    this.oConfig.canvas.attr({
        width: window.innerWidth,
        height: window.innerWidth
    });
}


/**
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} data
 * @returns {unresolved}
 */
ChartHelper.prototype.drawNode = function (x, y, data) {
    var bseFill = "#fff";

    if (this._selectedNode
            && jQuery.data(this._selectedNode.node, "data")
            && jQuery.data(this._selectedNode.node, "data").id == data.id) {
        var bseFill = this._selectionColor;
    }


    var r1 = this.oConfig.canvas.rect(x, y, this.oConfig.cardWidth, this.oConfig.cardHeight).attr({
        fill: bseFill,
        stroke: "#2c3e50",
        strokeWidth: 0.5
    });

    var r2 = this.oConfig.canvas.rect(x + 5, y + 5, this.oConfig.cardWidth - 10, this.oConfig.cardHeight - 10).attr({
        fill: this.nodeGrad1,
        stroke: "#2c3e50",
        strokeWidth: 0.2
    });
    var r3 = this.oConfig.canvas.text(x + 15, y + 30, data.action).attr({
        fill: "#fff",
        stroke: "#fff"
    });
    return this.oConfig.canvas.g(r1, r2, r3).attr({cursor: "pointer"});
};

/**
 * 
 * @param {type} sx
 * @param {type} sy
 * @param {type} ex
 * @param {type} ey
 * @returns {undefined}
 */
ChartHelper.prototype.drawLine = function (sx, sy, ex, ey) {
    var xGap = sx + (ex - sx) / 2;
    var yGap = sy + (ey - sy);
    var thik = 2;
    var color = "#353D47";
    var l1 = this.oConfig.canvas.line(sx, sy, xGap, sy).attr({
        fill: color,
        stroke: color,
        strokeWidth: thik
    });
    var l2 = this.oConfig.canvas.line(xGap, sy, xGap, yGap).attr({
        fill: color,
        stroke: color,
        strokeWidth: thik
    });
    var l3 = this.oConfig.canvas.line(xGap, yGap, ex - 5, yGap).attr({
        fill: color,
        stroke: color,
        strokeWidth: thik,
        markerEnd: this.arrowMark
    });

    return this.oConfig.canvas.g(l1, l2, l3);
};

/**
 * 
 * @returns {undefined}
 */
ChartHelper.prototype.clear = function () {
    this.oConfig.canvas.clear();
    this.gList = [];
    this.nodeGrad1 = this.oConfig.canvas.gradient("L(100, 100, 100, 0)#4E9AF8-#4E9AF8");

    var arrPath = this.oConfig.canvas.path("M0,0 V4 L2,2 Z").attr({fill: "#353D47", stroke: "#353D47"});

    this.arrowMark = arrPath.marker(0, 0, 4, 6, 0.1, 2);

    this.oConfig.canvas.rect(0, 0, 6000, 6000).attr({
        fill: this.oConfig.canvas.rect(0, 0, 10, 10).attr({
            stroke: "#666",
            strokeWidth: 0.1,
            fill: "#ffffff"
        }).pattern(0, 0, 10, 10)
    });
};


ChartHelper.prototype._updateSelection = function (node) {
    this._selectedNode = node;
};


ChartHelper.prototype._clearSelection = function () {
    this._selectedNode = null;
    this.gList.map(function (v) {
        v[0].attr({fill: "#fff"});
        return v;
    });
};
/**
 * 
 * @param {type} sx
 * @param {type} sy
 * @param {type} oData
 * @returns {ChartHelper.prototype.drawFlow.ly}
 */
ChartHelper.prototype.drawFlow = function (sx, sy, oData) {
    if (!oData)
        return;

    var oEl = this.drawNode(sx, sy, oData);
    this.gList.push(oEl);
    jQuery.data(oEl.node, "data", oData);

    var that = this;
    oEl.click(function (event) {
        that._clearSelection();
        that._updateSelection(this);

        this[0].attr({fill: that._selectionColor});
        var evt = new CustomEvent("nodeClick", {'detail': jQuery.data(this.node, "data")});
        window.dispatchEvent(evt);
    });

    var ly = sy;
    if (oData.next && oData.next.length) {
        for (var i = 0; i < oData.next.length; i++) {
            var ch = oData.next[i];
            var cx = sx + this.oConfig.cardWidth + this.oConfig.cardHGap;
            var cy = ly + (this.oConfig.cardHeight + this.oConfig.cardVGap) * (i ? 1 : 0);

            var ly = this.drawFlow(cx, cy, ch);
            this.drawLine(sx + this.oConfig.cardWidth, sy + this.oConfig.cardHeight / 2, cx, cy + this.oConfig.cardHeight / 2);
        }
    }
    return ly;
};