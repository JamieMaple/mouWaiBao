let brand = []
let appData = []
let query = {
  type: '',
  malfunction: '',
  method: ''
}
// status rember
let flag = 0
const SITE = 'http://www.yuanwell.com/ywpage/index.php'
// ajax send query post
// site, type, query, callback
function ajaxQuery(dataObj){
  let xmlhttp = new XMLHttpRequest()

  const site = dataObj.site || ''
  const type = dataObj.type || 'post'
  let query = dataObj.query || null
  let callback = dataObj.callback || function(){}
  let async
  if (dataObj.async === false) {
    async = false
  } else {
    async = true
  }
  console.log(async)

  if (query) {
    query = queryToString(query)
  }
  xmlhttp.open(type, site, async)
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

// init 
window.addEventListener('load', function(){
  // get the basic dom
  let main_body = document.getElementsByClassName('body-main')[0]
  let wrapper = main_body.getElementsByClassName('selection-wrapper')
  // init show
  wrapper[0].getElementsByClassName("options")[0].style.display = 'block'
  // addEventListener to each selection node
  let selection = main_body.getElementsByClassName('selection')
  for(let i = 0, length = selection.length; i < length; i++){
    let select_icon = selection[i].getElementsByClassName('select-icon')[0]
    let select_ul = wrapper[i].getElementsByClassName('options')[0]
    // selection display control
    selection[i].addEventListener('click', () => {
      if (!select_ul.style.display || select_ul.style.display === 'none'){
        allSelectionHidden()
        select_ul.style.display = 'block'
        select_icon.innerHTML = '<i class="ion-android-arrow-dropup"></i>'
      }else{
        select_ul.style.display = 'none'
        select_icon.innerHTML = '<i class="ion-android-arrow-dropdown"></i>'
      }
    }, false)
    // selection change flag
    ;(function(i){
      selection[i].addEventListener('click', () => {
        flag = i
      }, false)
    })(i)
  }

  // change brand
  ajaxQuery( { site: '/portal/phone/brand', type: 'post', callback: changeBrand, async: false } )
  // change models
  ajaxQuery( { site: '/portal/phone/modex', type: 'post', query: { brand: brand[0] }, callback: changeWrapperFromOneToFour } )
  // change contact num
  ajaxQuery( { site: '/portal/phone/num', type: 'post', callback: changeNum } )
}, false)

// change li 
function changeWrapperFromOneToFour(data){
  // get the basic dom
  let main_body = document.getElementsByClassName('body-main')[0]
  let wrapper = main_body.getElementsByClassName('selection-wrapper')
  let iPhoneModels = []
  appData = data
  // defaultData
  
  appData.forEach( (val) => iPhoneModels.push(val.type) )

  let defaultData = [
    iPhoneModels,                                      // models
    appData[0].color,                                  // model-color
    appData[0].malfunction,                            // malfunction
    appData[0].methods
  ]
  // default set
  query = {
    type: iPhoneModels[0],
    malfunction: appData[0].malfunction[0],
    method: appData[0].methods[0]
  }
  // init page
  const TYPE = 1
  for (let i = TYPE, length = TYPE + defaultData.length; i < length; i++){
    // defaultChangeFlag
    flag = i
    createOrChangeItems(defaultData[i-TYPE], wrapper[i])
  }
  // reset flag
  flag = 0

  let payPage = document.getElementsByClassName('pay-page')[0]
  let nextPage_button = document.getElementsByClassName('pay')[0].getElementsByClassName('next')[0]
  let prevPage_buttons = payPage.getElementsByClassName('prev-page')
  // nextPage
  nextPage_button.addEventListener('click', function() {
    let color = main_body.getElementsByClassName('color-hook')[0].innerHTML
    query.type = main_body.getElementsByClassName('type-hook')[0].innerHTML,
    query.method = main_body.getElementsByClassName('method-hook')[0].innerHTML
    console.log(query)
    ajaxQuery({site: '/portal/phone/price', query, type: 'post', callback: changePrice})
    // change text
    ;(function changeText() {
      payPage.getElementsByClassName('type-hook')[0].innerHTML = query.type
      payPage.getElementsByClassName('color-hook')[0].innerHTML = color
      payPage.getElementsByClassName('malfunction-hook')[0].innerHTML = query.malfunction
      payPage.getElementsByClassName('method-hook')[0].innerHTML = query.method
    })()
    payPage.style.transform="translate3d(0, 0, 0)"
  })
  // prevPage
  for(let i = 0, length = prevPage_buttons.length; i < length; i++) {
    prevPage_buttons[i].addEventListener('click', function() {
      payPage.style.transform="translate3d(100%, 0, 0)"
    })
  }
}

// create list-items of options , first parameter only allow Array
function createOrChangeItems(data, wrapper){
  let option = wrapper.getElementsByClassName('options')[0]

  let s = ''
  for(let i = 0, items_length = data.length; i < items_length; i++){
    s += `<li class="li-hook"><a class="text-hook" href="javascript:;">${data[i]}</a></li>`
  }

  option.innerHTML = s
  // default add
  defaultAdd(wrapper)
  // addEventListener
  addSomeClickEvents(wrapper)
}

function defaultAdd(wrapper){
  let option = wrapper.getElementsByClassName('li-hook')[0]
  let choose = wrapper.getElementsByClassName('choose')[0]
  const TEXT = option.getElementsByClassName('text-hook')[0].innerHTML

  option.classList.add('active')
  choose.innerHTML = TEXT
}

function addSomeClickEvents(wrapper){
  // get doms
  let selection = wrapper.getElementsByClassName('selection')[0]
  let select_icon = selection.getElementsByClassName('select-icon')[0]
  let choose = selection.getElementsByClassName('choose')[0]
  let select_ul = wrapper.getElementsByClassName('options')[0]
  let li_objs = select_ul.getElementsByClassName('li-hook')

  // addEventListener to each li in li_objs of selection node
  for(let i = 0, li_length = li_objs.length; i < li_length; i++){
    let li = li_objs[i]
    // active click
    const TYPE = 1
    const COLOR = 2
    const MALFUNCTION = 3
    const METHODS = 4
    console.log('option', flag)
    if (flag !== MALFUNCTION) {
      // add active class
      li.addEventListener('click', function() {
        for(let ii = 0, length = li_objs.length; ii < length; ii++){
          li_objs[ii].className = 'li-hook'
        }
        this.classList.add('active')
      })
      // this wrapper text change
      li.addEventListener('click', (e) => {
        const TEXT = e.target.innerHTML
        choose.innerHTML = TEXT
      }, false)
    } else if (flag === MALFUNCTION) {
      // click active
      let active_lis = select_ul.getElementsByClassName('active')
      li.addEventListener('click', function() {
        if (this.classList.contains('active')) {
          if (active_lis.length === 1){
            return
          }
          this.classList.remove('active')
        } else {
          this.classList.add('active')
        }
      })
      li.addEventListener('click', function() {
        let malfunctions = []
        for (let ii = 0, length = active_lis.length; ii < length; ii++) {
          malfunctions.push(active_lis[ii].getElementsByTagName('a')[0].innerHTML)
        }
        query.malfunction = malfunctions.toString()
        if (String(malfunctions).length <= 10) {
          
          choose.innerHTML = query.malfunction
        } else {
          choose.innerHTML = query.malfunction.toString().substr(0, 10)+'...'
        }
      })
    }
    // click change next
    
    let next_wrapper = wrapper.nextElementSibling

    li.addEventListener('click', function(e) {
      console.log(flag)
      switch (flag) {
        case TYPE: 
          for ( key in  appData ) {
            if (e.target.innerHTML === appData[key].type) {
              // color
              flag = COLOR
              createOrChangeItems(appData[key].color, next_wrapper)
              // malfunction 
              flag = MALFUNCTION
              createOrChangeItems(appData[key].malfunction, next_wrapper.nextElementSibling)
              // methods
              flag = METHODS
              createOrChangeItems(appData[key].methods, next_wrapper.nextElementSibling.nextElementSibling)
              // reset to type
              flag = TYPE
            }
          }     
      }
    })
  }
}

function allSelectionHidden(){
  let allSelection = document.querySelectorAll('.options')
  let allSelectIcon = document.querySelectorAll('.select-icon')

  // display all selection
  allSelection.forEach((val) => {
    val.style.display = 'none'
  })
  allSelectIcon.forEach((val) => {
    val.innerHTML = '<i class="ion-android-arrow-dropdown"></i>'
  })
}
// callbacks 
function changeBrand(data){
  let brand_wrapper = document.getElementsByClassName('selection-wrapper')[0]
  let brands = brand_wrapper.getElementsByClassName('li-hook')
  data.forEach((val) => {brand.push(val.name)})
  createOrChangeItems(brand, brand_wrapper)
  for(let i = 0, length = brands.length; i < length; i++) {
    brands[i].addEventListener('click', (e) => {
      ajaxQuery( {site: '/portal/phone/modex', query: {brand: e.target.innerHTML}, callback: changeWrapperFromOneToFour})
    })
  } 
  console.log('brand')
}
function changePrice(data) {
  document.getElementsByClassName('pay-page')[0]
    .getElementsByClassName('price-hook')[0].innerHTML = '￥'+data.price.toFixed(2)
}
function changeNum(data) {
  var contact = document.getElementsByClassName('contact-tel')
  for (let i = 0, length = contact.length; i < length; i++) {
    contact[i].href='tel:'+data.num
  }
}