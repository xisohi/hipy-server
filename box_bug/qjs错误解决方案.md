1.改壳子的代码:
```java
private void createObj() {
        String spider = "__JS_SPIDER__";
        String global = "globalThis." + spider;
        String content = Module.get().fetch(api);
        if (content.startsWith("//bb")) {
            cat = true;
            ctx.execute(Module.get().bb(content));
        } else {
            content = content.replace(spider, global);
            if (content.contains("__jsEvalReturn") && !content.contains("export default")) {
                cat = true;
            }
            ctx.evaluateModule(String.format(Module.get().fetch("assets://js/lib/spider.js"), api));
        }
        jsObject = (JSObject) ctx.get(ctx.getGlobalObject(), spider);
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