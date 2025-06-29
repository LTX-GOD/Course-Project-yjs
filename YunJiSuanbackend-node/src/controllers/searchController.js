const searchService = require('../services/searchService');

class SearchController {
    async search(req, res) {
        try {
            const { query } = req.body;

            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid search query'
                });
            }

            const results = await searchService.search(query);

            return res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Search controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async compatSearch(query) {
        try {
            const results = await searchService.search(query);

            // 转换为前端期望的格式
            return results.map(item => ({
                title: item.title,
                id: item.id,
                algorithm_label: Array.isArray(item.tags) ? item.tags.join(' ') : item.tags,
                difficulty: item.difficulty,
                url: item.url,
                status_info: 'Success!',
                times: item.relevance.toString()
            }));
        } catch (error) {
            console.error('Compat search error:', error);
            throw error;
        }
    }
}

module.exports = new SearchController(); 