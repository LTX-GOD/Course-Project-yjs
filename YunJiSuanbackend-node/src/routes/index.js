const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// 搜索路由
router.post('/search', searchController.search.bind(searchController));

module.exports = router; 