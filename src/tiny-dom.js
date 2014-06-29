(function(exports, arr, doc) {
    // addEventListener support
    var add = doc.addEventListener;

    /**
     * tinyDom Class
     * @param selector
     */
    function td(selector) {
        // DOM Selector
        var result = /^s/.test(typeof selector) ?
            doc['getElement' +
                // Id Asked ?
                (selector[0] == '#' ? 'ById' :
                    // Class asked ? if no tag
                    selector[0] == '.' ? 'sByClassName' : 'sByTagName')]
                        (/^\.|^\#/.test(selector) ? selector.slice(1) : selector, '') :
                            // selector was not a string ? return selector itselfs
                            selector;

        // Creating Array if result was id
        if(!result.length) result = [result];

        // Pushing results to instance
        for(var i = 0; i < result.length; i++) {
            arr.unshift.call(this, result[i]);
        }
    };

    /**
     * Main function, param is mixed
     * If it's function ? will call DOMReady callback
     * If it's string ? will call DOMSelector and return tinyDom instance
     * @param query
     * @returns {*}
     */
    function $(query) {
        return /^f/.test(typeof query) ?
            /c/.test(doc.readyState) ?  query() :
                add ? $(doc).on('DOMContentLoaded', query) :
                    doc.attachEvent("onreadystatechange", /c/.test(doc.readyState) && query()) :
                        new td(query);
    };

    /**
     * Wrap the Object event to have several options
     * TODO: add other requirements
     * @param evt
     * @returns {*}
     */
    function wrapEvent(evt) {
        evt.preventDefault = function() {
            evt.returnValue = false;
        }
        return evt;
    }

    $.prototype = td.prototype = {
        length: 0,

        /**
         * Bind event to set of elements
         * @param evtName (name of the event)
         * @param cb (callback function)
         * @returns {*}
         */
        on: function(evtName, cb) {
            return this.each(function(elt) {
                add ? elt.addEventListener(evtName, cb) :
                        elt.attachEvent('on' + evtName, function(evt) {
                            cb(wrapEvent(evt));
                        });
            });
        },

        /**
         * Unbind event to set of elements
         * @param evtName (name of the event)
         * @param cb (callback function)
         * @returns {*}
         */
        off: function(evtName, cb) {
            return this.each(function(elt) {
                add ? elt.removeEventListener(evtName, cb):
                    elt.detachEvent('on' + evtName, function(evt) {
                        cb(wrapEvent(evt));
                    });
            })
        },

        /**
         * Add a class to the set of elements
         * TODO: trim className
         * @param name
         * @returns {*}
         */
        addClass: function(name) {
            return this.each(function(elt) {
                elt.className += ' ' + name;
            });
        },

        /**
         * Remove a class to the set of elements
         * TODO: trim className
         * @param name
         * @returns {*}
         */
        removeClass: function(name) {
            return this.each(function(elt) {
                elt.className = elt.className.replace(new RegExp(name, 'g'), '');
            })
        },

        /**
         * Inject HTML String to the set of elements
         * @param string
         */
        html: function(string) {
            return !string ? this[0].innerHTML : this.each(function(elt) {
                elt.innerHTML = string;
            });
        },

        /**
         * Iterates on the set of elements
         * @param callback
         * @returns {td}
         */
        each: function(callback) {
            for(var i = 0; i < this.length; i++) {
                callback.call(this[i], this[i], i, this);
            }
            return this;
        },

        /**
         * Splice method because tinyDom instance
         * must be considered as an Array
         */
        splice: arr.splice
    };
    $.version = '0.1.0';

    exports.$ = $;
})(window.exports || window, [], document);