
# directory-tree

print your directory on shell and clipboard.

## Get Started

- Bash
```sh
npm i -g print-dir
pdir [.] [-t ./theme.json] [--igd "node,theme"] [--sort dir] [-o ./out.txt] [-m 5]
```

- Package
```js
var dirTree  = require('print-dir')

let treeData = dirTree({
    dir: '.',
    theme: {
       "node": "├── ",
       "pipe": "│   ",
       "last": "└── ",
       "indent": "    ",
       "dir_suffix": "/"
    },
    maxLev: 2,
    ignoresFile: [],
    ignoresDir: [],
    prefix: " ",
    isLine: false, // don't print line by line
    sort: ""
})
/*
 return 
treeData.treeString
treeData.infoString
treeData.fileNum
treeData.dirNum
*/
```

## Default Options

```js
const default_options = {

    t: path.resolve(__dirname, "./themes/default.json"), // theme of char
    _: [process.cwd()],           // directory
    igf: "",                    // ignores files (regular expression matching)
    igd: "",                    // ignores dirs (regular expression matching)
    prefix: '',                 // prefix of each line
    pa: false,                  // print all at once
    sort: ''                    // file sort by "file"/"dir", default is sort by filename.
    // o: "./out.txt"           // store where
    //m: 1                      // max Level

}
```

## Default Theme

```json
{
    "node": "├── ",
    "pipe": "│   ",
    "last": "└── ",
    "indent": "    ",
    "dir_suffix": "/"
}
```