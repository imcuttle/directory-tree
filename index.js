/**
 * Created by Moyu on 16/9/11.
 */

const fs     =  require('fs')
const path   =  require('path')
const colors =  require('colors/safe')

const NL = "\n"
let SP = ""
let fileNum = 0, dirNum = 0

function generateInfoStr(fileNum, dirNum) {
    return `${dirNum} directories, ${fileNum} files.`
}


function isIgnoredFile(filename, ignoresFile) {
    return ignoresFile.some(m => {
        if(m == '')
            return false;
        return new RegExp(m).test(filename)
    })
}

function isIgnoredDir(dirname, ignoresDir) {
    return ignoresDir.some(m => {
        if(m == '')
            return false;
        return new RegExp(m).test(dirname)
    })
}

function isIgnored(stat, ignoresDir, ignoresFile) {
    let f = stat.name

    return /^\./.test(f)
        || stat.isDirectory() && isIgnoredDir(f, ignoresDir)
        || stat.isFile() && isIgnoredFile(f, ignoresFile)
}

function newLine(string) {
    return string + NL;
}


/*
 bootstrap/
 ├── css/
 │   ├── bootstrap.css
 │   ├── bootstrap.min.css
 │   ├── bootstrap-theme.css
 │   └── bootstrap-theme.min.css
 ├── js/
 │   ├── bootstrap.js
 │   └── bootstrap.min.js
 ├── fonts/
 ├── glyphicons-halflings-regular.eot
 ├── glyphicons-halflings-regular.svg
 ├── glyphicons-halflings-regular.ttf
 └── glyphicons-halflings-regular.woff

 bootstrap/
 ├── less/
 ├── js/
 ├── fonts/
 ├── dist/
 │   ├── css/
 │   ├── js/
 │   └── fonts/
 ├── docs/
 └── examples/
 */


function generateDirectoryStr(dirname, theme, maxLev, ignoresDir=[], ignoresFile=[],
                              isLine, sort, level=1, depth=[], SP='') {
    function makeFileLineStr(depth, isLast, stat) {

        return SP + depth.join('')
            + (isLast?theme.last:theme.node)
            + stat.name + (stat.isFile()?"":theme.dir_suffix);
    }
    
    if(maxLev && level > maxLev) {
        return '';
    }

    let filenames = fs.readdirSync(dirname)
    
    let stats = filenames.reduce((c, f) => {

        let stat = fs.statSync(path.join(dirname, f))

        stat.name = f

        // remove ignored files
        if(isIgnored(stat, ignoresDir, ignoresFile)) {
            return c;
        }

        return c.concat(stat)

    }, []).sort((a,b) => {
        // default sort by filename
        if(sort=='dir' || sort=='file') {
            if(a.isDirectory()) {
                if(b.isDirectory())
                    return a.name.localeCompare(b.name)
                return sort=='dir' ? -1 : 1
            } else {
                if(b.isDirectory())
                    return sort=='dir' ? 1 : -1
                return a.name.localeCompare(b.name)
            }
        } else {
            return a.name.localeCompare(b.name)
        }
    })
    
    let outString = level==1 ? SP + path.basename(path.resolve(dirname)) + theme.dir_suffix  : ''
    if(isLine && outString!='') {
        console.log(colors.blue(outString))
        outString = newLine(outString)
    }
    

    return stats.reduce((prev, next, index) => {

        let newDepthArr = level==1 ? [] : depth.slice(0)
        let isLast = index == stats.length-1

        let str = makeFileLineStr(newDepthArr, isLast, next)

        isLine && console.log(colors.blue(str))

        prev += newLine(str)

        if(next.isDirectory()) {

            let childpath = path.join(dirname, next.name)

            if(isLast) {
                newDepthArr.push(theme.indent)
            } else {
                newDepthArr.push(theme.pipe)
            }

            prev += generateDirectoryStr(childpath, theme, 
                maxLev, ignoresDir, ignoresFile, isLine, sort, level+1, newDepthArr, SP)
            
            dirNum++

        } else {
            
            fileNum++
            
        }

        return prev

    }, outString)

}


module.exports = function (options) {
    dirNum = fileNum = 0
    return {
        treeString: generateDirectoryStr(
            options.dir, 
            options.theme || JSON.parse(fs.readFileSync(path.resolve(__dirname, "./themes/default.json")).toString()),
            options.maxLev || null,
            options.ignoresDir || [],
            options.ignoresFile || [],
            options.isLine,
            options.sort,
            1,
            [],
            options.prefix || SP
        ),
        infoString: generateInfoStr(fileNum, dirNum),
        fileNum: fileNum,
        DirNum: dirNum
    }
}