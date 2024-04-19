const category = "bedroom"
const folder = `/Users/minhdv/My\ Drive/flashcards/${category}`
const fs = require('fs')
function pbcopy(data) {
    var proc = require('child_process').spawn('pbcopy');
    proc.stdin.write(data); proc.stdin.end();
    console.log("copied to clipboard")
}
const lines = fs.readdirSync(folder).filter(e => e !== ".DS_Store").map(element => {

    // return element.split('.')[0].replace(/-/g, ' ')
    return element.split('.')[0].toLocaleLowerCase() + ". "
    // return element.split('.')[0].toLocaleLowerCase() + "<break time='0.2s'/>"

})

const allLines = lines.join('\n')
console.log(allLines)
pbcopy(allLines)