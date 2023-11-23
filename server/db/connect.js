/**
 * 该文件负责连接数据库
 */

const mongoose = require('mongoose')

// 定义链接数据库字符串
// 本地
const dbURI = "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;
// 部署
// const dbURI = 'mongodb://moonxi:123123@127.0.0.1:27017/coderstation?authSource=coderstation'

// 连接
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

// 监听
mongoose.connection.on('connected', function () {
  console.log(`coderstation 数据库已经连接...`)
})
