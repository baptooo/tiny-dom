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
    function loop(tplStr, term, obj, index, termLen, expFrags) {
        // Output string that will be generated
        var _out = '',
            // Start index of the fragment
            start = index + termLen,
            // Caching the total length of the template
            strLen = tplStr.length,
            // Fragment initialization
            loopTplStr = '';

        // Parsing tplStr to store the fragment
        for(var i = start; i < strLen; i++) {
            var char = tplStr[i];
            // Parser will stop only when meeting the end expression for the current loop
            if(char == '{' && tplStr.substr(i, termLen) == '{{/' + term + '}}') {
                break;
            }
            // Storing the fragment character by character
            loopTplStr += char;
        }

        // Storing fragment to retrive it later
        expFrags.push(loopTplStr);

        // LoopObj data node
        var loopObj = getRef(term, obj);
        // Doing nothing if asked data is missing
        // (doing it only now to be able to store the expFrag)
        if(!loopObj) return '';

        // Processing fragment for each data node item
        for(var i = 0; i < loopObj.length; i++) {
            // Recursive call to process to generate fragment
            _out += process(loopTplStr, /^o/.test(typeof loopObj[i]) ? loopObj[i] : {'.' : i}, expFrags)[0];
        }
        return _out;
    };

    /**
     * Retrieves the asked path on the given object
     * @param path
     * @param obj
     * @returns {*}
     */
    function getRef(path, obj) {
        return obj[path] != undefined ? obj[path] : (function(split) {
            var term = split.pop();
            for(var i = 0; i < split.length; i++) {
                obj = obj[split[i] || ''];
            }
            return obj ? obj[term] != undefined ? obj[term] : '' : '';
        })(path.split('.'));
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
        return [tplStr.replace(reg, function(m,k,index) {
            // Matching expression case
            var exp = k.match(exps)[0] || '', term = k.replace(exp, '');
            // Calling generator for each expression
            switch(exp) {
                // Loop
                case '#':
                    return loop(tplStr, term, obj, index, m.length, expFrags);
                // Partial
                case '>':
                    return tpl.cache[term] ? tpl(term, obj) : '';
                // End tag
                case '/':
                    return '';
            };
            // Eval asked term and returns it or empty string if undefined
            return getRef(k, obj);
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