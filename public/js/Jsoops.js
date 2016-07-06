(function (winReff) {
    if (!winReff.Jsoops) {
        winReff.Jsoops = {};
    }
    String.prototype.toCamelCase = function () {
        return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return letter.toUpperCase();
        }).replace(/\s+/g, '').replace(/_/g, '');
    };

    var j = winReff.Jsoops;
    /**
     * 
     * @param {type} sName
     * @param {type} fnConstructor
     * @returns {Jsoops_L1.j._checkNameSpace.base}
     */
    j._checkNameSpace = function (sName, fnConstructor) {
        var aNames = sName.split("\.");
        var base = winReff, len = aNames.length;
        for (var k = 0; k < len - 1; k++) {
            var i = aNames[k];

            if (!base.hasOwnProperty(i)) {
                base[i] = {};
            }
            base = base[i];
        }
        base[aNames[len - 1]] = fnConstructor;
        return base[aNames[len - 1]];
    };

    /**
     * Refering to namespace object
     * @param {string} sName
     * @returns {object} object reference of namespace.
     */
    j._getNameSpace = function (sName) {
        var aNames = sName.split("\.");
        var base = winReff, len = aNames.length;
        for (var k = 0; k < len; k++) {
            var i = aNames[k];

            if (!base.hasOwnProperty(i)) {
                base[i] = {};
            }
            base = base[i];
        }
        return base;
    };

    /**
     * 
     * @param {type} sName
     * @param {type} oConfig
     * @returns {window.JOOPS.defineClass.mem|oConfig.public|oConfig.static|Jsoops_L1.j.defineClass.jC|window.JOOPS.defineClass.jC}
     */
    j.defineClass = function (sName, oConfig) {
        oConfig = Object.create(oConfig);
        /**
         * Constructing namespace and applying constructor to same.
         * Calling base constructor from inherited constructor if base class is available.
         * 
         * @type @exp;j@call;_checkNameSpace|@exp;Jsoops_L1@pro;j@pro;defineClass@pro;mem|@exp;Jsoops_L1@pro;j@pro;defineClass@pro;mem
         */
        var jC = j._checkNameSpace(sName, oConfig.init);
        var oBase = {};
        if (oConfig.extend) {
            oBase = typeof (oConfig.extend) === "string" ? j._getNameSpace(oConfig.extend).prototype : oConfig.extend.prototype;
        }

        var oProtoConf = {
            "_class": {
                value: sName,
                writable: false,
                enumerable: false,
                configurable: true
            },
            "_deff": {
                value: oConfig,
                writable: false,
                enumerable: false,
                configurable: false
            },
            "getClass": {
                value: function () {
                    return j._getNameSpace(this._class);
                },
                writable: false,
                enumerable: false,
                configurable: true
            },
            "_type": {
                value: "class",
                writable: false,
                enumerable: false,
                configurable: true
            },
            "toString": {
                value: function () {
                    return "[@" + this._class + "]";
                },
                writable: true,
                enumerable: false,
                configurable: true
            },
            "equals": {
                value: function (oTarget) {
                    return oTarget === this;
                },
                writable: false,
                enumerable: false,
                configurable: true
            }
        };
        var oTemp = {};
        if (oConfig.public) {
            for (var k in oConfig.public) {
                var mem = oConfig.public[k];
                if (typeof (mem) === "function") {
                    oProtoConf[k] = {
                        value: mem,
                        writable: false,
                        enumerable: false,
                        configurable: true
                    };
                } else {
                    oTemp[k] = mem;
                    oProtoConf['get' + k.toCamelCase()] = {
                        value: Function("return this._mem['" + k + "'];"),
                        writable: false,
                        enumerable: false,
                        configurable: true
                    };
                    oProtoConf['set' + k.toCamelCase()] = {
                        value: Function("newValue", "this._mem['" + k + "'] = newValue;"),
                        writable: false,
                        enumerable: false,
                        configurable: true
                    };

                }
            }
        }
        if (oBase._mem) {
            var oClone = Object.create(oBase._mem);
            for (var i in oClone) {
                oTemp[i] = oClone[i];
                oProtoConf['get' + i.toCamelCase()] = {
                    value: Function("return this._mem['" + i + "'];"),
                    writable: false,
                    enumerable: false,
                    configurable: true
                };
                oProtoConf['set' + i.toCamelCase()] = {
                    value: Function("newValue", "this._mem['" + i + "'] = newValue;"),
                    writable: false,
                    enumerable: false,
                    configurable: true
                };
            }
        }

        oProtoConf["_mem"] = {
            value: oTemp,
            writable: true,
            enumerable: true,
            configurable: true
        };

        jC.prototype = Object.create(oBase, oProtoConf);
//        jC.prototype.constructor = jC;
        /**
         * Defining static members.
         */
        if (oConfig.static) {
            for (var k in oConfig.static) {
                jC[k] = oConfig.static[k];
            }
        }

        return jC;
    };
})(window);