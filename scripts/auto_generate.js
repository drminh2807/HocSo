const fs = require("fs");
const categories = fs.readdirSync("/Users/minhdrminh/Documents/audio").filter(e => e !== ".DS_Store");
// Function to generate the words array
function generateWordsArray(category) {
    const folder = `/Users/minhdrminh/Documents/flashcards/${category}`
    return fs.readdirSync(folder).filter(e => e !== ".DS_Store").map(element => {
        const word = element.split('.')[0];
        return `{ en: "${word}", viSound: require("assets/audio/${category}/vi/${word}.wav"), enSound: require("assets/audio/${category}/en/${word}.wav"), image: require("assets/images/${category}/${word}.jpg")  }, `
    });
}
const firstLine = "\
interface Word {\n\
  en: string\n\
  viSound: number\n\
  enSound: number\n\
  image: number\n\
}\n\
\n\
export const words: Word[] = [\n\
"
// Generate the words array
const generatedWordsArray = categories.map(category => generateWordsArray(category)).reduce((acc, val) => acc.concat(val), []);

const allLines = [firstLine, ...generatedWordsArray, "]"].join("\n");
// Save the JSON string to a file
fs.writeFileSync("app/models/Database.ts", allLines, "utf8");

console.log("Words array generated and saved to 'app/models/Database.ts'");