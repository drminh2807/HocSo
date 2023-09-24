const name = "shallow. bad. beautiful. big. bitter. bright. cheap. clean. cold. dark. day. deep. dirty. dry. empty. expensive. fast. fat. few. full. good. hard. heavy. hot. light. long. many. new. night. noisy. old. quiet. rough. short. slow. small. smooth. soft. strong. sweet. tall. thin. ugly. weak. wet. young"
const audioPath = "/Users/minhdrminh/Downloads/audio/adjective/vi"
const nameArray = name.split(". ")
const fs = require("fs");
const dir = fs.readdirSync(audioPath)
for (let index = 1; index <= dir.length; index++) {
    fs.renameSync(audioPath + "/" + index + ".wav", audioPath + "/" + nameArray[index - 1] + ".wav")
}
