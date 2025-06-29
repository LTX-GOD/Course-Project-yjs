const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    const parts = line.trim().split(' ', 2);
    if (parts.length === 2) {
        const docID = parts[0];
        const text = parts[1];
        const words = text.split(' ');
        for (const word of words) {
            console.log(`${word} ${docID}`);
        }
    }
});

rl.on('error', (err) => {
    console.error('Error reading standard input:', err);
    process.exit(1);
});