const category = "activity"
const language = "en"
const imagePath = `/Users/minhdrminh/Documents/flashcards/${category}`
const audioPath = `/Users/minhdrminh/Documents/audio/${category}/${language}`
const fs = require("fs");
const imageName = fs.readdirSync(imagePath).map(element => element.split('.')[0]).filter(e => e)
const dir = fs.readdirSync(audioPath).filter(e => e.split('.')[0])
if (dir.length !== imageName.length) {
    console.log(`not match audio: ${dir.length}; image: ${imageName.length}`)
    return
}
for (let index = 1; index <= dir.length; index++) {
    console.log(`rename ${index}.wav to ${imageName[index - 1]}.wav`)
    fs.renameSync(audioPath + "/" + index + ".wav", audioPath + "/" + imageName[index - 1] + ".wav")
}
