## 技术栈

- Node.js
- Express.js
- SQLite3
- Redis
- Docker

## 功能特性

- 文本检索和倒排索引
- LeetCode 题目数据的存储和检索
- 高性能的缓存系统
- RESTful API 接口

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
复制 `.env.example` 文件为 `.env` 并修改配置

3. 运行服务：
```bash
npm start
```
## hadoop
```
  516  hdfs dfs -put ~/input.txt /input/
  517  hdfs dfs -rm /input
  518  hdfs dfs -mkdir /input
  519  hdfs dfs -put ~/input.txt /input/
  520  hdfs dfs -ls /input
  521  hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-3.3.6.jar   -D mapreduce.job.maps=4 -D mapreduce.job.reduces=4   -files mapper.js,reducer.js   -mapper "node mapper.js" -reducer "node reducer.js"   -input /input/input.txt -output /output
  522  hdfs dfs -ls /output
  523  root@iZbp1dna6mg0wez9yd3q0aZ:~# hdfs dfs -ls /output
  524  Found 5 items
  525  -rw-r--r--   1 root supergroup          0 2025-06-02 15:33 /output/_SUCCESS
  526  -rw-r--r--   1 root supergroup       7257 2025-06-02 15:33 /output/part-00000
  527  -rw-r--r--   1 root supergroup       7533 2025-06-02 15:33 /output/part-00001
  528  -rw-r--r--   1 root supergroup       6982 2025-06-02 15:33 /output/part-00002
  529  -rw-r--r--   1 root supergroup       7295 2025-06-02 15:33 /output/part-00003
  530  clear
  531  hdfs dfs -get /output ~/hadoop_output
  532  ls
  533  cd hadoop_output/
  534  ls
  535  cat part-00001
  ```
## API 文档

### 搜索接口
- 端点：`/api/search`
- 方法：POST
- 参数：
  - `query`: 搜索关键词
- 返回：匹配的题目列表

## 目录结构

```
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── models/        # 数据模型
│   ├── routes/        # 路由
│   ├── services/      # 业务逻辑
│   └── utils/         # 工具函数
├── .env.example       # 环境变量示例
├── .gitignore        # Git 忽略文件
├── Dockerfile        # Docker 配置
├── package.json      # 项目配置
└── README.md         # 项目说明
``` 
