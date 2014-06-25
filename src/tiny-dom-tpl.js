(function(exports, word, exps, arr, u) {

    function loop(tplStr, term, obj) {
        if(!obj[term]) return '';

        var _out = '',
            start = tplStr.indexOf('#' + term) + term.length + 3,
            end = tplStr.indexOf('/' + term) - 2,
            loopTplStr = tplStr.substring(start, end),
            loopObj = obj[term];

        for(var i = 0; i < loopObj.length; i++) {
            var isObj = /^o/.test(typeof loopObj[i]);
            _out += process(loopTplStr, isObj ? loopObj[i] : {'key' : i});
        }
        return _out;
    };

    var reg = new RegExp('\{\{(' + exps + word + ')\}\}', 'gi');
    function process(tplStr, obj) {
        return tplStr.replace(reg, function(m,k) {
            var exp = k.match(exps)[0] || '', term = k.replace(exp, '');
            switch(exp) {
                case '#':
                    return loop(tplStr, term, obj);
                    break;
            };
            return obj[k] == u ? '' : obj[k];
        });
    }
    function tpl(str,obj) {
        return process(tpl.cache[str] || str, obj);
    };
    tpl.cache = {};

    exports.tpl = tpl;
})(window, '\\w+', '[#|\/]{0,1}', [], undefined);