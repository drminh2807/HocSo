const category = "alphabet"
const imagePath = `/Users/minhdrminh/Documents/flashcards/${category}`
const audioPath = `/Users/minhdrminh/Downloads/audio/${category}/vi`
const fs = require("fs");
const imageName = fs.readdirSync(imagePath).map(element => element.split('.')[0])
const dir = fs.readdirSync(audioPath)
for (let index = 1; index <= dir.length; index++) {
    fs.renameSync(audioPath + "/" + index + ".wav", audioPath + "/" + imageName[index - 1] + ".wav")
}
