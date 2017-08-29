const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use('/portal/phone/iphone', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));

var appData = require('./data.json')
// post
app.post('/portal/phone/modex', (req, res) => {
  res.send(appData)
})
app.post('/portal/phone/price', (req, res) => {
  console.log(req.body)
  res.send(JSON.stringify({ price: 200 }))
})
app.post('/portal/phone/num', (req, res) => {
  res.send(JSON.stringify({ num: '123455666' }))
})

const APP_PORT = 3000

app.listen(APP_PORT, function(){
  console.log(`listening on port ${APP_PORT}`)
})
