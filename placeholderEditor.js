// all js , with placeholderEditor.d.ts

// customEvent
class cCustomEvent {
/**
 * 伪代码实现
 * 
// attention: CustomEvent是Event的一个子类，同理MouseEvent也是Event的一个子类，你也可以自定义new MouseEvent(...)
  let event = new CustomEvent('xEvent', {
    detail: {x: 'xxxxxxxx'},//detail是关键字，只有放在了detail里面才可以被接收到
    bubbles: true,//是否允许冒泡
    cancelable: true// 为true时，允许自定义事件调用stopPropagation阻止冒泡
  })
  btn.addEventListener('xEvent', ( e )=>{
    console.log( 'btn x Event', e )
    e.stopPropagation()
  })
  div.addEventListener('xEvent', ( e )=>{
    console.log( 'div x Event', e )
  })
  btn.dispatchEvent(event)//自主触发
 * 
 */
}

class CreateBlobByDom {
  constructor(domStr, className, style, width, height) {
    this._initImgSvg(domStr, className, style, width, height)
  }

  // you should compress string for replace to real value
  _initImgSvg(domStr, className, style, width, height) {
    let data = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${width||100}" height="${height||20}">
      <foreignObject width="100%" height="100%">
        ${style || ''}
        <div class="${className || ''}" xmlns="http://www.w3.org/1999/xhtml">
          ${domStr || '未知'}
        </div>
      </foreignObject>
    </svg>`
    data = data.replace(/[\n|\t|\r]*/g, '')
    data = data.replace(/[\s]{2,}/g, '')
    this.data = data
  }

  _initSvg(domStr, className, style, width, height) {
    let data = `<svg xmlns="http://www.w3.org/2000/svg" width="${width || 100}" height="${height||20}">
      <foreignObject width="100%" height="100%">
        ${style || ''}
        <div class="${className || ''}" xmlns="http://www.w3.org/1999/xhtml">
          ${domStr || '未知'}
        </div>
      </foreignObject>
    </svg>`
    this.data = data
  }

  _img2Sanvas() {
    let img = new Image()
    return new Promise(( res, rej )=>{
      img.onload = function () {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let w = img.naturalWidth, h = img.naturalHeight
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h)
        res(canvas)
      }
      img.onerror = function () {
        rej(new Error('无法转成Img, 请检查传入的参数！'))
      }
      img.src = this.data
    })
  }

  _img2base64(imgType = 'png') {
    return new Promise(( res, rej )=>{
      this._img2base64()
        .then(( canvas )=>{
          let base64 = canva.toDataURL(`image/${imgType}`)//第三个参数指示分辨率
          res( base64 )
        })
        .catch(( error )=>{ rej(error)})
    })
  }
  /**
   * data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAYCAYAAACFms+HAAACMElEQVRYR+2Y7y4jURjGn9F2VIqthmgVkYh
   *  window.btoa// base64编码：// 注意：针对unicode进行编码是无法实现的，需要使用encodeURIComponent(str) 
   *  window.atob// base64解码：// 注意：针对unicode解码以后，需要使用decodeURIComponent()实现显示
   * 
   * @param {base64} base64 
   */
  _base642Blob(base64) {
    let arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
  }
  _base642File(base64, fileName) {
    let arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, {type: mime})
  }

  _file2Base64(file) {//event.target.files[0]   blob 是file的父类，blob应该也是可以被读取的
    let reader = new FileReader()
    return new Promise(( res, rej )=>{
      reader.onload = function ( base64 ) {
        res(base64)
      }
      reader.onerror = function () {
        rej(new Error("读取文件失败，请检查参数！"))
      }
      reader.readAsDataURL(file)
    })
  }

  /**
   * 伪代码实现
   * @param {} base64 
   * @param {} fileName 
   */
  _base642Xhr(base64, fileName) {
    let file = _base642File(base64, fileName)
    let fd = new FormData()
    fd.append('image', file, fileName)
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'url', true)
    xhr.send(fd)
  }

  getImgSvgHtml() {
    return this.data
  }
  getImgSvg() {
    return new Promise(( res, rej )=>{
      let img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')    // 防止跨域无法下载
      
      img.onload = function () { res(img) }
      img.onerror = function () { rej(new Error('无法生成ImgSvg，请检查参数！')) }
      img.src = this.data
    })
  }
  getImgBase64() {}
}


/**
 * @authod: sits
 * @说明：占位编辑器
 * 
 * @param {编辑器盒子，调用者传入} ele
 * option = {
 *  placeHolderTextList:[]// 占位的文本数组
 * }
 * @param {可选项} option
 * domEvent = {
 *  onInput: () => {},
 *  onFocus: () => {},
 *  onBlur: () => {}
 * }
 * @param {可监听的事件map, 支持三状态监听} domEvent
 * 
 * api说明：
 * let editor: Editor = new Editor(...)
 * edtior.init()//初始化
 * editor.addToEditor(text: string) // 传入占位文本（需在构造函数的时候定义过），插入到光标所在位置
 * editor.addTextToEditor(text: string)// 任意文本，插入光标所在位置
 * getValue(arg: string[]|(text:string)=>string)//将占位文本进行处理
 * getValueSource()获取输入框内的innerHTML
 * 
 * 调用示例：
 * 	let editor = new Editor(
			dom, 
			{placeHolderTextList: ['x','y','z','w']},
			{
				onFocus: function (e: any, editor: any) {
					// console.log( 'focus...',e, editor )
				},
				onInput: function (e: any, editor: any) {
					// console.log( 'onInput.....', e, editor )
				}
			}
		)
		editor.init()
    editor.addToEditor('x')
		
    // let res = editor.getValue(['${person}', '${car}', '${time}', '${add}'])
    let res = editor.getValue(function(value: any, index:number){
      return value
    })
 * 
 */
class Editor {
  constructor(ele, option, domEvent) {
    if( !ele.nodeType || !ele.nodeName ) {
      throw(new Error('请传入dom元素'))
    }
    this.domBox = ele
    this.option = option
    this.domEvent = domEvent
  }
  
  option = {}// 可选项
  domEvent = {}
  domBox = null// 编辑器盒子，调用者传入
  editorDom = null// 编辑器实际实现者
  placeHolderImgs = []// 根据占位文本生成的imgs


  static author = 'sits'
  static version = '1.0.0'
  static removeClass = (el, className) => {
    if (!el)  return
    let oldClassName = el.getAttribute('class') || ''
    oldClassName = oldClassName.replace(className + ' ', '')
    oldClassName = oldClassName.replace(' ' + className, '')
    oldClassName =  oldClassName.replace(className, '')
    el.setAttribute('class',oldClassName);
  }

  _initSetting() {
    let defaultSetting = {
      focusColor: '#409EFF',
      defaultColor: 'rgb(220, 223, 230)',
      maxLength: 200,
      placeHolderTextList: []//需要显示的占位文本
    }
    if( Object.prototype.toString.call(this.option) === '[object Object]' ) {
      this.option = {...defaultSetting, ...this.option}
    } else {
      this.option = defaultSetting
    }
  }

  _initDomEvent() {
    this.domEvent || (this.domEvent = {})
    let supportEvents = ['onFocus', 'onBlur', 'onInput']
    let domEvent = {}
    supportEvents.forEach(( key, i )=>{
      if( typeof this.domEvent[key] === 'function' ) {
        domEvent[key] = this.domEvent[key]
      } else {
        domEvent[key] = function() {}
      }
    })
    this.domEvent = domEvent
  }

  _initDom() {
    let editorDom = document.createElement('div')
    this.editorDom = editorDom
    editorDom.setAttribute('contenteditable', true)
    let editorDomStyle = {
      'outline': '0',
      'text-align': 'left',
      'word-wrap': 'break-word',
      'word-break': 'break-all',
      '-webkit-user-modify': 'read-write-plaintext-only',
      'line-height': '24px',
      'font-size': '12px'
    }
    for (const key in editorDomStyle) {
      if (editorDomStyle.hasOwnProperty(key))
        editorDom.style[key] = editorDomStyle[key]
    }
    let {onFocus, onBlur, onInput} = this.domEvent
    this.domBox.appendChild(editorDom)
    this.domBox.addEventListener('click', (  )=>{
      editorDom.focus()
    })
    editorDom.addEventListener('focus', ( e )=>{
      this.domBox.style.borderColor = this.option.focusColor
      onFocus(e, this)
    })
    editorDom.addEventListener('blur', ( e )=>{
      this.domBox.style.borderColor = this.option.defaultColor
      onBlur(e, this)
    })

    // 防止拖动复制，可以对
    editorDom.ondragstart = function () { return false }
    editorDom.addEventListener('input', ( e )=>{
      onInput(e, this)
    })
  }
  
  _initData() {
    let placeHolderTextList = this.option.placeHolderTextList
    if( placeHolderTextList && placeHolderTextList.length ) {
      this.option.placeHolderTextList.forEach((text, i) => {
        
        this._createImg(text, i)
          .then((img) =>{
            this.placeHolderImgs[i] = img
          })
          .catch(()=>{})
      })
    } else {
      throw(new Error('请输入需要占位的字段文本！'))
    }
  }

  /**
   * 
   * @param {文本} text 
   * @return {返回一个promise对象, promise.then((img)=>{img})} Promise
   */
  _createImg(text = '', i) {
    let imgObj = new CreateBlobByDom(
      `<span>${text}</span>`, 'drawDomBycanvas',
      `<style>
        .drawDomBycanvas {
          color: #999;
          border-radius: 3px;
          box-sizing: border-box;
          background: #c1d9f1;
          font-size: 12px;
          padding: 0 5px;
          line-height: 24px;
        }
      </style>`, text.length * 12 + 10, 24 )
    
    return imgObj.getImgSvg()
  }

  /**
   * @param {placeHolderTextList中， 文本的索引} index 
   * api说明：
   * 1. let selection = window.getSelection()   selection对象(更为宏观的概念，而range是包含在selection中，range更像是selection的实现)
   *  selection.toString() 选中的文本
   * 2. let range = selection.getRangeAt(0)  获取选区的范围
   */
  _insertToEditorAtCursorPosition(dom) {
    this.editorDom.focus()
    let sel, range
    if( window.getSelection ) {
      sel = window.getSelection()
      if( sel.getRangeAt && sel.rangeCount ) {
        range = sel.getRangeAt(0)// 一般此参数都是0，获取光标对象
        range.deleteContents()//删除内容

        let el = document.createElement('div')
        el.appendChild(dom)
        let frag = document.createDocumentFragment(), node, lastNode

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        if( lastNode ) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)//光标移动到最后
          range.collapse(true)// 开始和结束光标置于同一位置
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    } else if(document.selection && document.selection.type !== 'Control'){
      // let svgHtml = new CreateBlobByDom(this.option.placeHolderTextList[index]).getImgSvgHtml()
      // document.selection.createRange().pasteHTML(svgHtml)
      document.selection.createRange().insertNode(dom)
    }
  }

  _insertPlaceHolderTextToEditor(index) {
    if( this.placeHolderImgs[index] && this.placeHolderImgs[index].nodeName ) {
      let dom = this.placeHolderImgs[index].cloneNode(true)
      this._insertToEditorAtCursorPosition(dom)
    }
  }
  
  /**
   * 
   * @param {需要添加进富文本的文本，此str必须是placeHolderTextList中的一个} str 
   */
  addToEditor(str) {
    let index = this.option.placeHolderTextList.indexOf(str)
    if( index === -1 ) {
      console.warn('没有该文本， 请重新选择')
      return
    }
    // auto append to the cursor position
    this._insertPlaceHolderTextToEditor(index)
  }

  addTextToEditor(text = '') {
    let textDom = document.createTextNode(text)
    this._insertToEditorAtCursorPosition(textDom)
  }
  
  /**
   * selection的相关操作
   * @param {需要被选中的dom} dom
   */
  _setSelection(dom, start = 0, end = 0) {
    let selection = window.getSelection()

    // 移除已经选中的dom(chrome无法多选，故要移除)
    selection.removeAllRanges()

    let range = document.createRange()
    range.selectNode(dom)
    // range.selectNodeContents(dom)// 相当于 dom.innerHTML

    // 可省略
    range.setStart(dom, start)
    if(end === 0)range.setEndAfter(dom)
    // 可省略
    else range.setEnd(dom, end)

    selection.addRange(dom)
  }

  /**
   * @param {dom位置} dom 
   * @param {插入的文本} text 
   * attention：创建的range需要设置selectNode以后再inserNode，不然会默认插入doctype,造成报错
   */
  _insertByRange() {
    let selection = window.getSelection()
    selection.removeAllRanges()
    let range = document.createRange()
    let span = document.getElementById('span')
    range.selectNode(span)
    range.setStart(span, 0)
    range.setEnd(span, 0)
    let newSpan = document.createElement('span')
    newSpan.appendChild(document.createTextNode('span'))
    range.insertNode(newSpan)
    range.setStartAfter(span)
    range.setEndAfter(span)
    selection.addRange(range)
  }

  init() {
    this._initSetting()
    this._initDomEvent()
    this._initDom()
    this._initData()
  }

  /**
   * 获取值
   *  对应placeholderTextList的包装内容，可以是list,list必须和placeholderList对应起来
   * 
   * 也可以是一个function，加工占位符，需要有返回值
   * @param {加工占位符的内容} wrapperPlaceholder
   * 
   */
  getValue(wrapperPlaceholder) {
    let childNodes = this.editorDom.childNodes
    let nodeNames = ['#text', 'IMG'], values = []
    const TEXT = nodeNames[0], IMG = nodeNames[1]
    let ptls = this.option.placeHolderTextList.map(v => encodeURIComponent(v))
    let placeHolderTextList = this.option.placeHolderTextList


    // 定义一个内部方法，抹平数组和方法之间的调用差异
    let handlePlaceholder = function(value) {return value}
    if( typeof wrapperPlaceholder === 'function' ) {
      handlePlaceholder = function (value, i) {
        return wrapperPlaceholder(value) || ''
      }
    } else if( Object.prototype.toString.call(wrapperPlaceholder) === '[object Array]' ) {
      handlePlaceholder = function (value, i) {
        return wrapperPlaceholder[i] || ''
      }
    } 

    childNodes.forEach(( v, i )=>{
      if( v.nodeName === TEXT ) {
        values[i] = v.data
      } else if(v.nodeName === IMG) {
        for (let j = 0; j < ptls.length; j++) {
          if( v.src.indexOf(ptls[j]) !== -1 ) {
            values[i] = handlePlaceholder(placeHolderTextList[j], j)
            break
          }
        }
      }
    })
    return values.join('')
  }

  // 由于匹配环境过于恶劣，正则暂时无法实现
  createReg() {}

  getValueSource() {
    return this.editorDom.innerHTML
  }
}


export const addClass = (el, className) =>{
  if (!el)  return
  let oldClassName = el.getAttribute('class') || ''
  if(!oldClassName.includes(className)){
    oldClassName = oldClassName.concat(' ' + className);
  }
  el.setAttribute('class', oldClassName);
}



export default Editor

