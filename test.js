// test.js

var dirTree = require('./index')

console.log(dirTree({
    dir: '.',
    theme: {
       "node": "├── ",
       "pipe": "│   ",
       "last": "└── ",
       "indent": "    ",
       "dir_suffix": "/"
    },
    maxLev: 2,
    isLine: false, // don't print line by line
    sort: ""
}).treeString)