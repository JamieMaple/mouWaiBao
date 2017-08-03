const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use('/iphone', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

var appData = require('./data.json')

app.get('/iphone/api', (req, res) => {
  res.send(appData)
})
// get
app.get('/iphone/query', (req, res) => {
  console.log(req.query)
  res.send(req.query)
})
app.get('/iphone/query/iPhone/:iPhone/color/:color/malfunction/:malfunction/option/:option/method/:method', (req, res) => {
  console.log(req.params)
  res.send(req.params)
})
// post
app.post('/iphone/query', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

const APP_PORT = 3000

app.listen(APP_PORT, function(){
  console.log(`listening on port ${APP_PORT}`)
})
