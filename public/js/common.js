// ajax send query post
// site, type, query, callback
function ajaxQuery(dataObj){
  let xmlhttp = new XMLHttpRequest()

  const site = dataObj.site || ''
  const type = dataObj.type || 'post'
  let query = dataObj.query || null
  let callback = dataObj.callback || function(){}

  if (query) {
    query = queryToString(query)
  }
  xmlhttp.open(type, site, true)
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      let data = JSON.parse(this.responseText)
      callback(data)
    }
  }
  xmlhttp.send(query)
}
// query change to string
function queryToString(queryObj, sym1 = '=', sym2 = '&'){
let arr = []
let i = 0
for (key in queryObj){
  arr[i] = encodeURIComponent(key) + sym1 + encodeURIComponent(queryObj[key])
  i++
}
return arr.join(sym2)
}