const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// 创建 Express 应用
const app = express();

// 中间件配置 - 更宽松的 CORS 设置
app.use(cors({
    origin: '*', // 在生产环境中应该设置为具体的前端域名
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 添加请求日志
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 路由配置
app.use('/api', routes);

// 添加与前端兼容的路由
app.get('/results.html', async (req, res) => {
    try {
        console.log('Search request received:', req.query);
        const { search } = req.query;
        if (!search) {
            console.log('No search query provided');
            return res.status(400).json({ status_info: 'Search query is required' });
        }

        const searchController = require('./controllers/searchController');
        const results = await searchController.compatSearch(search);
        console.log('Search results:', results.length, 'items found');
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ status_info: error.message });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

module.exports = app;