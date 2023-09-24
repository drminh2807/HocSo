const folder = '/Users/minhdrminh/Documents/flashcards/alphabet'
const fs = require('fs')
function pbcopy(data) {
    var proc = require('child_process').spawn('pbcopy');
    proc.stdin.write(data); proc.stdin.end();
    console.log("copied to clipboard")
}
const lines = fs.readdirSync(folder).map(element => {

    return "chữ " + element.split('.')[0].toLocaleLowerCase() + "<break time=0.5s/>"

})

const allLines = lines.join('\n')
console.log(allLines)
pbcopy(allLines)