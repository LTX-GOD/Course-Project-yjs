const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let currentWord = '';
let currentCounts = {};

rl.on('line', (line) => {
    const parts = line.trim().split(' ');
    if (parts.length === 2) {
        const word = parts[0];
        const docID = parts[1];
        if (currentWord && currentWord !== word) {
            printCounts(currentWord, currentCounts);
            currentCounts = {};
        }
        currentWord = word;
        currentCounts[docID] = (currentCounts[docID] || 0) + 1;
    }
});

rl.on('close', () => {
    if (currentWord) {
        printCounts(currentWord, currentCounts);
    }
});

rl.on('error', (err) => {
    console.error('Error reading standard input:', err);
    process.exit(1);
});

function printCounts(word, counts) {
    const pairs = [];
    for (const [docID, count] of Object.entries(counts)) {
        pairs.push(`(${docID.trim()},${count})`);
    }
    console.log(`${word} [${pairs.join(',')}]`);
}