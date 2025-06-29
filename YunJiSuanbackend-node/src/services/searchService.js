const db = require('../config/database');
const redis = require('../config/redis');
const indexLoader = require('../utils/indexLoader');

class SearchService {
    constructor() {
        this.CACHE_EXPIRE = 3600; // 1 hour cache
    }

    async search(query) {
        try {
            // 检查缓存
            const cacheKey = `search:${query}`;
            const cachedResult = await redis.get(cacheKey);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            }

            // 分词处理
            const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

            // 使用倒排索引搜索
            const searchResults = new Map();

            for (const keyword of keywords) {
                const wordResults = await indexLoader.searchWord(keyword);
                for (const result of wordResults) {
                    const current = searchResults.get(result.id) || { id: result.id, count: 0 };
                    current.count += result.count;
                    searchResults.set(result.id, current);
                }
            }

            // 从数据库获取完整的题目信息
            const results = [];
            for (const [id, data] of searchResults) {
                const questionInfo = db.prepare(`
                    SELECT 
                        title,
                        questionId,
                        difficulty,
                        algorithmLabel as tags,
                        questionUrl as url
                    FROM questions
                    WHERE questionId = ?
                `).get(id.toString()); // 转换为字符串，因为数据库中是文本类型

                if (questionInfo) {
                    results.push({
                        id: questionInfo.questionId,
                        title: questionInfo.title,
                        difficulty: questionInfo.difficulty,
                        tags: questionInfo.tags.split(' '),
                        url: questionInfo.url,
                        relevance: data.count
                    });
                }
            }

            // 按相关度排序
            const sortedResults = results.sort((a, b) => b.relevance - a.relevance);

            // 只返回前20个结果
            const topResults = sortedResults.slice(0, 20);

            // 缓存结果
            await redis.setex(cacheKey, this.CACHE_EXPIRE, JSON.stringify(topResults));

            return topResults;
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }
}

module.exports = new SearchService(); 