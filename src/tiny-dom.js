/**
 * Created by PRO11_6 on 24/06/2014.
 */
(function(exports, arr, doc) {
    // Supports addEventListener ?
    var add = doc.addEventListener;

    // Td Class
    function td(selector) {
        // DOM Selector
        var result = /^s/.test(typeof selector) ?
            document['getElement' +
                // Id Asked ?
                (selector[0] == '#' ? 'ById' :
                    // Class asked ? if no tag
                    selector[0] == '.' ? 'sByClassName' : 'sByTagName')](selector) :
                        // selector was not a string ? return selector itselfs
                        selector;

        // Creating Array if result was id
        if(!result.length) result = [result];

        // Pushing results to instance
        for(var i = 0; i < result.length; i++) {
            arr.unshift.call(this, result[i]);
        }
    };

    // Main function instantiates td or triggers domReady callback
    function $(query) {
        return /^f/.test(typeof query) ?
            /c/.test(doc.readyState) ?  query() :
                add ? $(doc).on('DOMContentLoaded', query) :
                    doc.attachEvent("onreadystatechange", /c/.test(doc.readyState) && query()) :
                        new td(query);
    };

    function wrapEvent(evt) {
        evt.preventDefault = function() {
            evt.returnValue = false;
        }
        return evt;
    }

    $.prototype = td.prototype = {
        length: 0,

        on: function(evtName, cb) {
            return this.each(function(elt) {
                add ? elt.addEventListener(evtName, cb) :
                        elt.attachEvent('on' + evtName, function(evt) {
                            cb(wrapEvent(evt));
                        });
            });
        },

        off: function(evtName, cb) {
            return this.each(function(elt) {
                add ? elt.removeEventListener(evtName, cb):
                    elt.detachEvent('on' + evtName, function(evt) {
                        cb(wrapEvent(evt));
                    });
            })
        },

        addClass: function(name) {
            return this.each(function(elt) {
                elt.className += ' ' + name;
            });
        },

        removeClass: function(name) {
            return this.each(function(elt) {
                elt.className = elt.className.replace(new RegExp(name, 'g'), '');
            })
        },

        each: function(callback) {
            for(var i = 0; i < this.length; i++) {
                callback.call(this[i], this[i], i, this);
            }
            return this;
        },

        splice: arr.splice
    };
    $.version = '0.1.0';

    exports.$ = $;
})(window.exports || window, [], document);