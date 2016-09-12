
# directory-tree

print your directory on shell and clipboard.

## Get Start
```sh
npm i -g print-dir
pdir [-t ./theme.json] [-d .] [--igd "node,theme"] [--sort dir] [-o ./out.txt] [-m 5]
```

## Default Options

```js
const default_options = {

    t: path.resolve(__dirname, "./themes/default.json"), // theme of char
    d: ".",                     // directory
    igf: "",                    // ignores files
    igd: "",                    // ignores dirs
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