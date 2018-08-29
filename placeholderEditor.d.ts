
declare module 'placeholderEditor' {
  export function addClass(el: HTMLElement, className: string): void

  interface fnForGV {
    (arg: string): string
  }
  interface domEvent {
    onInput: (e: any, editor: any)=>void
    onFocus: (e: any, editor: any)=>void
    onBlur: (e: any, editor: any)=>void
  }
  interface option {
    placeHolderTextList: string[]
  }
  export default class Editor {

    constructor(ele: HTMLElement, option: option, domEvent: domEvent)

    static author: string // 静态变量变量

    static removeClass(el: HTMLElement, className: string): void

    init(): void

    addToEditor(str: string): void
    
    addTextToEditor(str: string): void

    getValue(arg: string[] | fnForGV): string// 两种写法
    // getValue(arg: string[]|{(arg: string): string}): string
    getValueSource(): string

  }

}










