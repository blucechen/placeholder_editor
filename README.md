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

#### 参考资料
- [div转svg,svg转img](https://blog.csdn.net/u010081689/article/details/50728854)
- [contenteditable="true" 焦点位置插入节点](https://zhuanlan.zhihu.com/p/26567645)
- [svg转png](http://web.jobbole.com/84244/)
- [svg,file,base64,blob转化](https://my.oschina.net/hhtt/blog/1631636)
- [base64,blob,file互转2](https://blog.csdn.net/cuixiping/article/details/45932793)
- javascript高级程序设计3
