/**
 * tinyDomTpl, tiny template engine based on mustache syntax
 */
(function(exports, word, exps) {
    // Terms regexp
    var reg = new RegExp('\{\{(' + exps + word + ')\}\}', 'gi');

    /**
     * Loop expression function, returns expFrag for each data found in loopObj node
     * @param tplStr
     * @param term
     * @param obj
     * @param expFrags
     * @returns {string}
     */
    function loop(tplStr, term, obj, expFrags) {
        // LoopObj data node
        var loopObj = eval('obj.' + term);
        // Doing nothing if asked data is missing
        if(!loopObj) return '';
        // Output string that will be generated
        var _out = '',
            // Start index of the expression
            start = tplStr.indexOf('#' + term) + term.length + 3,
            // End index of the expression
            end = tplStr.indexOf('/' + term) - 2,
            // Template fragment extracted
            loopTplStr = tplStr.substring(start, end);

        // Storing fragment to retrive it later
        expFrags.push(loopTplStr);

        // Processing fragment for each data node item
        for(var i = 0; i < loopObj.length; i++) {
            // Recursive call to process to generate fragment
            _out += process(loopTplStr, /^o/.test(typeof loopObj[i]) ? loopObj[i] : {'key' : i}, expFrags)[0];
        }
        return _out;
    };

    /**
     * Parser function, returns the template string formated
     * with data given
     * @param tplStr
     * @param obj
     * @param expFrags
     * @returns {string}
     */
    function process(tplStr, obj, expFrags) {
        // Executing parser for each occurence found in tplStr via reg
        return [tplStr.replace(reg, function(m,k) {
            // Matching expression case
            var exp = k.match(exps)[0] || '', term = k.replace(exp, '');
            // Calling generator for each expression
            switch(exp) {
                // Loop
                case '#':
                    return loop(tplStr, term, obj, expFrags);
                // Partial
                case '>':
                    return tpl.cache[term] ? tpl(term, obj) : '';
                // End tag
                case '/':
                    return '';
            };
            // Eval asked term and returns it or empty string if undefined
            return eval('obj.' + k) != undefined ? eval('obj.' + k) : '';
        }), expFrags];
    }

    /**
     * Clean the expression frags found while parsing
     * TODO: can be better, not found atm
     * @param str
     * @param frags
     * @returns {*}
     */
    function cleanFrags(str, frags) {
        // Loop for each fragment found
        for(var i = 0; i < frags.length; i++) {
            // Replacing fragment with empty string in template result string
            str = str.replace(frags[i].replace(reg, ''), '');
        }
        return str;
    }

    /**
     * Main function that will be exported outside closure
     * @param str, can be HTMLString or template name that will be retrieved from cache
     * @param obj
     * @returns {*}
     */
    function tpl(str, obj) {
        // Processing the current template
        var processed = process(tpl.cache[str] || str, obj, []);
        // Returns pure or cleaned template if expression were found
        return processed[1].length ? cleanFrags(processed[0], processed[1]) : processed;
    };
    tpl.cache = {};

    exports.tpl = tpl;
})(window.exports || window, '[\\w\\.]+', '[\>|#|\/]{0,1}');