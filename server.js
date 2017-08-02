const express = require('express')
const app = express()
const path = require('path')

app.use('/iphone', express.static(path.join(__dirname, 'public')))

var appData = require('./data.json')

app.get('/iphone/api', (req, res) => {
  res.send(appData)
})
app.get('/iphone/query', (req, res) => {
  console.log(req.query)
  res.send(req.query)
})

const APP_PORT = 3000

app.listen(APP_PORT, function(){
  console.log(`listening on port ${APP_PORT}`)
})
