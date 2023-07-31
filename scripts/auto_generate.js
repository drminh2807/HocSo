const fs = require("fs");

// Function to generate a random number within a given range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate the words array
function generateWordsArray(wordsList) {
    const wordsArray = [];
    const audioPathTemplate = "../../assets/audio/animal_1/Animal";
    const imagePathTemplate = "assets/images/animal_1/";

    for (let i = 0; i < wordsList.length; i++) {
        const word = wordsList[i];
        const wordData = `{ en: "${word}",  viSound: require("${audioPathTemplate}${i + 1}.wav"), image: require("${imagePathTemplate}${word.toLowerCase()}.jpeg")  },  `
        wordsArray.push(wordData);
    }

    return wordsArray;
}

// List of animal words
const animalWords = [
    "alligator", "frog", "octopus", "skunk", "anteater", "giraffe", "ostrich", "sloth", "arctic fox",
    "goat", "otter", "badger", "gorilla", "owl", "bat", "guinea pig", "panda", "bear", "hawk", "parrot",
    "squid", "beaver", "hedgehog", "peacock", "squirrel", "bird", "hen", "penguin", "starfish", "bison",
    "hippo", "pig", "stingray", "bugs", "horse", "pigeon", "swordfish", "camel", "hyena", "plankton", "tarantula",
    "cat", "iguana", "platypus", "tiger", "chicken", "jellyfish", "polar bear", "toucan", "cow", "kangaroo",
    "puffin", "turtle", "coyote", "killer whale", "quail", "urchin", "crab", "koala", "queen bee", "vulture",
    "crocodile", "lemur", "rabbit", "walrus", "deer", "leopard", "raccoon", "whale", "dog", "lion", "rat",
    "wolf", "dolphin", "lizard", "rhino", "x-ray fish", "donkey", "llama", "rooster", "yak", "duck", "lobster",
    "scorpion", "zebra", "eagle", "mole", "seagull", "eel", "monkey", "seahorse", "elephant", "moose", "seal",
    "fish", "mouse", "shark", "flamingo", "narwhal", "sheep", "fox", "newt", "shrimp"
];

// Generate the words array
const generatedWordsArray = generateWordsArray(animalWords);

// Save the JSON string to a file
fs.writeFileSync("generated_words.json", generatedWordsArray.join('\n'), "utf8");

console.log("Words array generated and saved to 'generated_words.json'");