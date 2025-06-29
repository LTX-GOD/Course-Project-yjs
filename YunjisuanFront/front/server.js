const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// 静态文件服务
app.use(express.static(path.join(__dirname, '')));

// 定义根路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 为results.html路由注入环境变量
app.get('/results.html', (req, res) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:9999';
  console.log('Backend URL:', backendUrl); // 添加日志
  
  // 读取原始HTML文件
  fs.readFile(path.join(__dirname, 'results.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading results.html:', err);
      res.status(500).send('Error reading file');
      return;
    }
    
    // 在 <head> 标签结束前注入环境变量
    const envScript = `
	<script>
		window.BACKEND_URL = '${backendUrl}';
		console.log('Injected BACKEND_URL:', window.BACKEND_URL);
	</script>
</head>`;
    
    const modifiedHtml = data.replace('</head>', envScript);
    
    res.send(modifiedHtml);
  });
});

// 启动服务器
const port = 5173;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment BACKEND_URL:', process.env.BACKEND_URL);
});
