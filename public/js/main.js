// store data
var appData, iPhoneModels, malfunction, methods
// init and rember the query
var query = { iPhone: '', color: '', malfunction: '', option: '', method: '' }
var prev_query = Object.assign({}, query)
// status rember
var flag = 0

window.addEventListener('load', function(){
  // get the basic dom
  let wrapper = document.getElementsByClassName('selection-wrapper')
  // init show
  wrapper[0].getElementsByClassName("options")[0].style.display = 'block'
  // get ajax data
  let xmlhttp = new XMLHttpRequest()
  let site = '/iphone/api'
  xmlhttp.open('get', site, true)
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
      appData = JSON.parse(this.responseText)
      iPhoneModels = appData.iPhone
      malfunction = appData.malfunction
      methods = appData.methods
      let arrModels  = Object.keys(iPhoneModels)
      let arrMalfunction = Object.keys(malfunction)

      let defaultData = [
        iPhoneModels,                                      // models
        iPhoneModels[arrModels[0]].color,  // model-color
        malfunction,                                       // malfunction
        malfunction[arrMalfunction[0]].option,   // malfunction-option
        methods
      ]
      // init page
      for (let i = 0, length = defaultData.length; i < length; i++){
        // defaultChangeFlag
        flag = i
        createOrChangeItems(defaultData[i], wrapper[i])
      }
      // defaultQuey
      ajaxQuery(query)
      // clone query to prev_query
      prev_query = Object.assign({}, query)

      // reset flag
      flag = 0
    }
  }

  xmlhttp.send()

  // addEventListener to each selection node
  let selection = document.getElementsByClassName('selection')
  for(let i = 0, length = selection.length; i < length; i++){
    let select_icon = selection[i].getElementsByClassName('select-icon')[0]
    let select_ul = wrapper[i].getElementsByClassName('options')[0]
    // selection display control
    selection[i].addEventListener('click', () => {
      if (!select_ul.style.display || select_ul.style.display === 'none'){
        allSelectionHidden()
        select_ul.style.display = 'block'
        select_icon.innerHTML = '^'
      }else{
        select_ul.style.display = 'none'
        select_icon.innerHTML = 'v'
      }
    }, false)
    // selection change flag
    selection[i].addEventListener('click', () => {
      flag = i
    }, false)
  }
  // addEventListener to alert
  let phoneDiv = document.getElementsByClassName('col-2')[0]
  phoneDiv.addEventListener('click', () => {
    alert('123')
  })
}, false)

// create list-items of options , first parameter only allow Array or Object
function createOrChangeItems(data, wrapper){
  let option = wrapper.getElementsByClassName('options')[0]
  if (!Array.isArray(data)){
    data = Object.keys(data)
  }
  let s = ''
  for(let i = 0, items_length = data.length; i < items_length; i++){
    s += `<li class="li-hook"><a class="text-hook" href="#">${data[i]}</a></li>`
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
  // change query
  queryChange(TEXT)
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
    // this wrapper text change
    li.addEventListener('click', (e) => {
      const TEXT = e.target.innerHTML
      choose.innerHTML = TEXT
    }, false)
    // this wrapper display
    li.addEventListener('click', () => {
      let prev = select_ul.getElementsByClassName('active')[0]
      if(!prev){
        li.classList.add('active')
      }else{
        prev.classList.remove('active')
        li.classList.add('active')
      }
      select_ul.style.display = 'none'
      select_icon.innerHTML = 'v'
    }, false)
    // next wrapper display block
    li.addEventListener('click', () => {
      if (wrapper.nextElementSibling) {
        let next_wrapper = wrapper.nextElementSibling
        next_wrapper.style.display = 'block'
        // models and malfunction next options
          let next_ul = next_wrapper.getElementsByClassName('options')[0]
          let next_icon = next_wrapper.getElementsByClassName('select-icon')[0]
          if (!next_ul.style.display || next_ul.style.display === 'none'){
            next_ul.style.display = 'block'
            next_icon.innerHTML = '^'
          }
      }
    })
    // change items list
    li.addEventListener('click', (e) => {
      if(flag === 0 || flag === 2){
        let next_wrapper = wrapper.nextElementSibling
        let text = e.target.innerHTML
        var data

        if(flag === 0){
          data = iPhoneModels[text].color
        }else{
          data = malfunction[text].option
        }
        flag += 1
        createOrChangeItems(data, next_wrapper, flag)
      }else{
        flag += 1
      }
      console.log(query)
      ajaxQuery(query)
    })
    // change query
    li.addEventListener('click', (e) => {
      queryChange(e.target.innerHTML)
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
    val.innerHTML = "v"
  })
}

function queryChange(text){
  switch (flag){
    case 0:
      query.iPhone=text
      break
    case 1:
      query.color=text
      break
    case 2:
      query.malfunction=text
      break
    case 3:
      query.option=text
      break
    case 4:
      query.method=text
      break
    default:
      console.log(`${text} , ${flag} ERROR!`)
  }
}
// ajax send query post
// function ajaxQuery(query){
//   if (!compareTwoObject(query, prev_query)){
//     let xmlhttp = new XMLHttpRequest()
//     // clone query to prev_query
//     prev_query = Object.assign({}, query)
//
//     const site = '/iphone/query'
//
//     xmlhttp.open('post', site, true)
//     xmlhttp.setRequestHeader("Content-Type", "application/json")
//     xmlhttp.send(JSON.stringify(query))
//   }else{
//     console.log('query equal')
//   }
// }
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
function ajaxQuery(query){
  if (!compareTwoObject(query, prev_query)){
    let xmlhttp = new XMLHttpRequest()
    let str = queryToString(query, '/', '/')
    console.log(str)
    // clone query to prev_query
    prev_query = Object.assign({}, query)

    const site = '/iphone/query' + '/' + str

    xmlhttp.open('get', site, true)

    xmlhttp.send(null)
  }else{
    console.log('query equal')
  }
}

// query change to string
function queryToString(queryObj, sym1, sym2){
  let arr = []
  let i = 0
  for (key in queryObj){
    arr[i] = key + sym1 + queryObj[key]
    i++
  }
  return arr.join(sym2)
}

// compare two Object
function compareTwoObject(objA, objB){
  let strA = JSON.stringify(objA)
  let strB = JSON.stringify(objB)
  if (strA === strB){
    return true
  }else{
    return false
  }
}
