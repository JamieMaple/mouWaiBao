let appData
let query = {
  type: '',
  malfunction: '',
  method: ''
}
// status rember
let flag = 0

window.addEventListener('load', function(){
  // get the basic dom
  let main_body = document.getElementsByClassName('body-main')[0]
  let wrapper = main_body.getElementsByClassName('selection-wrapper')
  // init show
  wrapper[0].getElementsByClassName("options")[0].style.display = 'block'
  // get ajax data
  let xmlhttp = new XMLHttpRequest()
  let site = '/iphone/api'
  xmlhttp.open('get', site, true)
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
      let iPhoneModels = []
      appData = JSON.parse(this.responseText)
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
      for (let i = 0, length = defaultData.length; i < length; i++){
        // defaultChangeFlag
        flag = i
        createOrChangeItems(defaultData[i], wrapper[i])
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
        let price = ajaxQuery(query)
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
  }

  xmlhttp.send()

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
  // addEventListener to alert
  // let phoneDiv = document.getElementsByClassName('col-2')[0]
  // phoneDiv.addEventListener('click', () => {

  // })
}, false)

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
    if (flag !== 2) {
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
    } else if (flag === 2) {
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
        if (malfunctions.length === 1) {
          choose.innerHTML = query.malfunction
        } else {
          choose.innerHTML = query.malfunction.substr(0, 3)+'...'
        }
      })
    }
    // click change next
    if (flag === 0) {
      li.addEventListener('click', (e) => {
        let next_wrapper = wrapper.nextElementSibling
        let text = e.target.innerHTML
        var data

        if (flag !== 0) {
          return
        }
        appData.forEach((val, key) => {
          if (text === val.type) {
            data = val.color
          }
        })
        createOrChangeItems(data, next_wrapper)
      })
    }
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
// ajax send query post
function ajaxQuery(query){
    let xmlhttp = new XMLHttpRequest()

    const site = '/iphone/query'
    query = queryToString(query)
    xmlhttp.open('post', site, true)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        changePrice(JSON.parse(this.responseText))
      }
    }
    xmlhttp.send(query)
}
function changePrice(data) {
  console.log(data)
  document.getElementsByClassName('pay-page')[0]
    .getElementsByClassName('price-hook')[0].innerHTML = '￥'+data.price.toFixed(2)
}
// ajax send query get
// @ like query?iPhone=iPhone5&color=白色&malfunction=屏幕&option=外屏损坏&method=上门快修
// function ajaxQuery(query){
//   if (!compareTwoObject(query, prev_query)){
//     let xmlhttp = new XMLHttpRequest()
//     let str = queryToString(query, '=', '&')
//     console.log(str)
//     // clone query to prev_query
//     prev_query = Object.assign({}, query)
//
//     const site = '/iphone/query' + '?' + str
//
//     xmlhttp.open('get', site, true)
//
//     xmlhttp.send(null)
//   }else{
//     console.log('query equal')
//   }
// }
// @ like query/iPhone/iPhone5/color/白色/malfunction/屏幕/option/外屏损坏/method/上门快修
// function ajaxQuery(query){
//   if (!compareTwoObject(query, prev_query)){
//     let xmlhttp = new XMLHttpRequest()
//     let str = queryToString(query, '/', '/')
//     // clone query to prev_query
//     prev_query = Object.assign({}, query)
//     const site = '/iphone/query' + '/' + str
//     xmlhttp.open('get', site, true)
//     xmlhttp.send(null)
//   }else{
//     console.log('query equal')
//   }
// }

// query change to string
function queryToString(queryObj, sym1, sym2){
  sym1 = sym1 || '='
  sym2 = sym2 || '&'
  let arr = []
  let i = 0
  for (key in queryObj){
    arr[i] = encodeURIComponent(key) + sym1 + encodeURIComponent(queryObj[key])
    i++
  }
  return arr.join(sym2)
}