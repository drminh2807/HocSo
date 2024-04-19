const category = "bedroom"
const language = "en"
const imagePath = `/Users/minhdv/My Drive/flashcards/${category}`
const audioPath = `/Users/minhdv/My Drive/audio/${category}/${language}`
const fs = require("fs");
const imageName = fs.readdirSync(imagePath).map(element => element.split('.')[0]).filter(e => e)
const dir = fs.readdirSync(audioPath).filter(e => e.split('.')[0])
if (dir.length !== imageName.length) {
    console.log(`not match audio: ${dir.length}; image: ${imageName.length}`)
    return
}
for (let index = 1; index <= dir.length; index++) {
    const audioName = index < 10 ? `0${index}`: `${index}`
    console.log(`rename ${audioName}.wav to ${imageName[index - 1]}.wav`)
    fs.renameSync(
      audioPath + "/" + audioName + ".wav",
      audioPath + "/" + imageName[index - 1] + ".wav",
    )
}
