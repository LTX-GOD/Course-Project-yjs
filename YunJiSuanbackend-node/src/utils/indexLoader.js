const fs = require('fs').promises;
const path = require('path');

class IndexLoader {
    constructor() {
        this.indexCache = new Map();
    }

    async loadIndex(filename) {
        if (this.indexCache.has(filename)) {
            return this.indexCache.get(filename);
        }

        const filePath = path.join(__dirname, '../../data', filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        const index = new Map();
        for (const line of lines) {
            if (!line.trim()) continue;

            // 解析每行的格式：(word) (docId,count),(docId,count)... 或 word (docId,count),(docId,count)...
            const match = line.match(/^\(?([^)]+)\)?\s+(.*)$/);
            if (!match) continue;

            const [, word, occurrences] = match;
            const docs = occurrences.match(/\((\d+),(\d+)\)/g)?.map(doc => {
                const [id, count] = doc.slice(1, -1).split(',').map(Number);
                return { id, count };
            }) || [];

            index.set(word.trim(), docs);
        }

        this.indexCache.set(filename, index);
        return index;
    }

    async searchWord(word, indexFiles = ['result1.txt']) {
        const results = new Map();

        for (const file of indexFiles) {
            try {
                const index = await this.loadIndex(file);
                const docs = index.get(word.toLowerCase());

                if (docs) {
                    for (const doc of docs) {
                        const current = results.get(doc.id) || 0;
                        results.set(doc.id, current + doc.count);
                    }
                }
            } catch (error) {
                console.error(`Error loading index from ${file}:`, error);
            }
        }

        return Array.from(results.entries())
            .map(([id, count]) => ({ id, count }))
            .sort((a, b) => b.count - a.count);
    }
}

module.exports = new IndexLoader(); 