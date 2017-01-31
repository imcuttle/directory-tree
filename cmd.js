#!/usr/bin/env node
/**
 * Created by Moyu on 16/9/12.
 */

const args   =  require('minimist')(process.argv.slice(2))
const fs     =  require('fs')
const path   =  require('path')
const colors =  require('colors/safe')
var dirTree  =  require('./index')

if (args._.length == 0 || args._[0] == '') {
    delete args._
} else {
    args._[0] = args._[0].toString()
}

if (args.h || args.help) {
    console.log([
            '',
            '  Usage: pdir [path] --options',
            '', '',
            '  Options: ',
            '',
            '    --igf <files>           ignored files,"a.txt,b.png"',
            '    --igd <directories>     ignored directories,"node_modules"',
            '    --sort <type>           file sort by "file/dir", default is sort by filename',
            '    --pa                    print all at once',
            '    -m <depth>              max depth of print tree',
            '    -o <path>               store where. eg. "./out.txt"',
            '    -t <path>               file of print directory string\'s character.',
            '                            default: "'+path.resolve(__dirname, "./themes/default.json")
    ].join('\r\n'))
    return;
}

const default_options = {

    t: path.resolve(__dirname, "./themes/default.json"), // theme of char
    _: ['.'],                   // directory
    igf: "",                    // ignores files
    igd: "",                    // ignores dirs
    prefix: '',                 // prefix of each line
    pa: false,                  // print all at once
    sort: ''                    // file sort by "file"/"dir", default is sort by filename.
    // o: "./out.txt"           // store where
    //m: 1                      // max Level

}

const NL = "\n"
let SP = " "

let options = Object.assign(default_options, args)

// check options is correct?
let theme, out, dir, maxLev, isLine, sort,
    ignoresFile, ignoreDirs

try {

    theme = JSON.parse(fs.readFileSync(options.t).toString())
    out     = options.o
    dir     = options._[0]
    maxLev  = options.m
    isLine  = !options.pa
    ignoresFile = options.igf.split(',').filter(x=>x!='')
    ignoresDir = options.igd.split(',').filter(x=>x!='')
    SP = options.prefix
    sort = options.sort

    if(!isDir(dir)) {
        throw new Error(`${dir} is not a directory.`)
    }

    let treeData = dirTree({
        dir,
        theme,
        maxLev,
        ignoresFile,
        ignoresDir,
        prefix: SP,
        isLine,
        sort
    })
    
    let treeStr = treeData.treeString, infoStr = treeData.infoString

    !isLine &&
    console.log(
        colors.blue(
            treeStr
        )
    )

    console.log(
        colors.green(
            NL + infoStr
        )
    )

    let data = newLine(treeStr) + infoStr
    
    if(out) {
        fs.writeFileSync(out, data);
        console.log(
            `stored into file ${out}.`
        )
    }

    pbcopy(data, () => {
        console.log(
            "copied!"
        )
    })

} catch (ex) {
    console.error(ex);
}


function isDir(file) {
    return fs.lstatSync(file).isDirectory()
}

function newLine(string) {
    return string + NL;
}

function pbcopy(data, callback) {
    var ncp = require("copy-paste");
    ncp.copy(data, callback)
}
