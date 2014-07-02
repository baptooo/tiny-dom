## TinyDom is a jQuery like DOM Selector library

## TinyDomTpl is a tiny template engine based on mustache syntaxe
1. Usage
    ```js
    tpl('<h1>{{title}}</h1>' + 
        '<ul>{{#items}}' + 
            '<li>{{label}}</li>' +
        '{{/items}}</ul>', {
            items: [
                { label: 'Foo' },
                { label: 'Bar' }
            ]
        });
    ```
    Will output: ```"<h1></h1><ul><li>Foo</li><li>Bar</li></ul>"```

### Inspired by ki.js https://github.com/dciccale/ki.js