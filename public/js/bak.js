window.onload = function(){
  // selection click events
  var dom = document.getElementsByClassName('selection-wrapper')

  let xhttp = new XMLHttpRequest()
  var appData
  xhttp.open('get', '/iphone/api', true)
  xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      appData = JSON.parse(this.responseText)
      let str = ""
      for(value in appData.models){
        str += `<li class="li-hook"><a href="#">${value}</a></li>`
      }
      dom[0].getElementsByClassName('options')[0].innerHTML = str
    }
  }
  xhttp.send()

  !function(){
    if (dom){
      for(let i = 0, length = dom.length; i < length; i++){
        let temp = dom[i].getElementsByClassName('selection')[0]
        let sp2 = temp.getElementsByTagName('span')[2]
        let sp3 = temp.getElementsByTagName('span')[3]
        let ul = dom[i].getElementsByClassName('options')[0]

        temp.addEventListener('click', (event) => {
          if (!ul.style.display || ul.style.display === 'none'){
            ul.style.display = 'block'
            sp3.innerHTML = '^'
            activeAdd(ul, sp2, sp3, i)
          }else{
            ul.style.display = 'none'
            sp3.innerHTML = 'v'
          }
        },false)
        // changePrice
      }
    }
  }()
}

// add class
  function activeAdd(ul, sp2, sp3, num){
    let li = ul.getElementsByClassName('li-hook')
    let prev = ul.getElementsByClassName('active')[0]
    // default add class
    if (!prev){
      li[0].classList.add('active')
      prev = li[0]
    }
    for(let i = 0, length = li.length; i < length; i++){
      let curr = li[i]
      curr.addEventListener('click', () =>{
        prev.classList.remove('active')
        curr.classList.add('active')

        const TEXT = curr.getElementsByTagName('a')[0].innerHTML
        sp2.innerHTML = TEXT

        // change text
        ul.style.display = 'none'
        sp3.innerHTML = 'v'

        // change price
        if(num === 4){
          changePrice(ul)
        }
      }, false)
    }
  }
  function changePrice(ul){
    const PRICE1 = 140
    const PRICE2 = 280

    let li  = ul.getElementsByClassName('li-hook')
    let price = document.getElementsByClassName('price')[0]

    if(li[1].classList.contains('active') || li[2].classList.contains('active')){
      price.innerHTML = '￥'+PRICE2
    }else{
      price.innerHTML = '￥'+PRICE1
    }
  }
