# placeholder_editor
一个输入框可以输入固定的文字，该文字不可编辑，取值时，固定的文字被替换成可以动态更换的信息

### 该editor包含
- 有关selection，range等选中和指针位置相关的代码
selection对象(更为宏观的概念，而range是包含在selection中，range更像是selection的实现
- base64,svg,blob,file相关转化代码
```js
canvas.toDataURL('image/png', 0.98)
new File([]....)

```
- 自定义事件及其触发条件，传值字段等代码
```js
dom.dispatchEvent(event)
```
