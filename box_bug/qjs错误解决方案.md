1.改壳子的代码:
```java
        if(content.startsWith("//bb")){
            cat = true;
            ctx.evaluateModule(String.format(Module.get().fetch("assets://js/lib/spider.js"), key + ".js") + "globalThis." + key + " = __JS_SPIDER__;", "tv_box_root.js");
        } else {
            if (content.contains("__jsEvalReturn") && !content.contains("export default")) {
                cat = true;
            }
            ctx.evaluateModule(String.format(Module.get().fetch("assets://js/lib/spider.js"), api) + "globalThis." + key + " = __JS_SPIDER__;\nconsole.log(typeof(" + key + "));console.log(Object.keys(globalThis." + key + "));", "tv_box_root.js");
        }

```
[qjs错误修复图片](./qjs错误修复.png)

2.修改文件spider.js  
```javascript
import * as spider from '%s'

if (!globalThis.__JS_SPIDER__) {
    if (spider.__jsEvalReturn) {
        globalThis.__JS_SPIDER__ = spider.__jsEvalReturn()
    } else if (spider.default) {
        globalThis.__JS_SPIDER__ = typeof spider.default === 'function' ? spider.default() : spider.default
    }
}
```
[spider.js](./spider.js)