OWL
===
Chrome 重定向工具

### 安装
 - 如果你可以翻墙，建议直接访问 [Chrome Webstore](https://chrome.google.com/webstore/detail/beknllkoddklgoflifhgkhkkibgkpdch)
 - 如果你翻不了墙，可以下载 [owl-redirector.crx](https://github.com/meowtec/Owl-redirector/blob/master/owl-redirector.crx?raw=true)，然后打开`扩展程序`页面，把`.crx`文件拖进去。
 - 如果前两种方法无效，请直接下载这个项目文件，然后以开发者模式加载，网上很多教程，此处略。

### 内置规则
扩展重新内置了几条规则，他们的功能包括：
 - 屏蔽 Google 分析、CNZZ 等。由于众所周知的原因，Google 分析会造成网页加载很慢。
 - Google 字体等 cdn 自动重定向到国内镜像。
 - Google 搜索结果直接跳转到第三方网页，加快速度。

也你可以根据你自己的需求任意添加。

### 使用方法
[Issue8: 如何添加规则？](https://github.com/meowtec/Owl-redirector/issues/8)

### 使用图解
#### 主界面
![screen1](http://meowtec.github.io/assets/owl/screen1_3.png)

 - 右上角是全局开关，启用状态为蓝色，禁用状态为灰色。
 - 左侧是规则列表，目前只有一条规则。如果规则被禁用，它的颜色会变淡。
 - 下面的三个图标分别是删除、编辑和禁用按钮。

#### 编辑界面
![screen2](http://meowtec.github.io/assets/owl/screen2_3.png)

 - 第一个输入框，输入你需要 redirect 或者阻止的 url，如果你需要屏蔽一组特定格式的 url，可以输入正则或者 URL Match。
 - 右侧的`[.*]`按钮可以把你输入的字符串转化为恒等的正则表达式，url 中通常有很多特殊字符，使用这个按钮可以快速转义它们。
 - 第二个输入框中输入的内容以右侧 CheckBox 选中的模式为准，三种模式分别是 `普通链接`,`文本内容`，`函数`：
  1. `普通链接`：请求会被自动重定向到此链接。
  2. `文本内容`：程序将这段文本编码为 dataURL，然后将请求重定向到此 dataURL。适合需要修改外链`css`/`js`(含jsonp)的情况。由于 `ajax` 的跨域特性，此方式并不能修改 ajax 请求返回内容。
  3. `函数`：在这里填入一个函数，函数参数为替换前的 url，函数返回值为替换后的 url。如果需要阻止请求，需要返回 `false`。

#### 函数返回值
 - 如果返回普通字符串，程序认为它是一个链接，则请求被重定向到这个链接；
 - 如果返回 false，请求会被阻止；
 - 如果返回 undefined/null，或者返回原 url，直接请求。

关于如何添加规则，也可以看 [Issue #8](https://github.com/meowtec/Owl-redirector/issues/8)。

### 实例

##### jquery.min.js 去 `min`
我们以 `jQuery` 官网为例，为了节省流量，jQuery 官网使用的是压缩后的 `jQuery.min.js` 文件，我们添加一条规则，把`jquery.min.js`重定向到`jquery.js`:
url:
```
http://ajax.lug.ustc.edu.cn/ajax/libs/jquery/1.11.2/jquery.min.js
```
replacer(url):
```
http://ajax.lug.ustc.edu.cn/ajax/libs/jquery/1.11.2/jquery.js
```

##### fc.5sing 跳转
5sing 被酷狗收购后，域名由 `5sing.com` 变成 `5sing.kugou.com`, 但是跳转没做好，于是 `http://fc.5sing.com/5936546.html` 无法正确跳转到 `http://5sing.kugou.com/fc/5936546.html`。

于是我添加了一条规则，让所有`fc.5sing.com`域名下的链接均能正常跳转到`5sing.kugou.com`域名。

url:
```
http://fc.5sing.com/*
```
replacer(函数):
```
function (url){
  var matchResult = url.match(/^http:\/\/fc\.5sing\.com\/(\d+)\.html.*$/)
  return 'http://5sing.kugou.com/fc/' + matchResult[1] + '.html'
}
```

#### google web fonts 替换为 ustc.edu.cn
url:
```
/^https?:\/\/(((ajax|fonts)\.googleapis\.com)|(themes\.googleusercontent\.com)|(fonts\.gstatic\.com))/
```
replacer(函数):
```
function (url){
  return url.replace('googleapis.com', 'lug.ustc.edu.cn')
            .replace('themes.googleusercontent.com', 'google-themes.lug.ustc.edu.cn')
            .replace('fonts.gstatic.com', 'fonts-gstatic.lug.ustc.edu.cn')
}
```

#### 干掉谷歌统计：

url:
```
http://www.google-analytics.com/analytics.js
```
replacer(url): 置空


### 内置方法
 - download()

 你可以在 replacer 函数中调用 download 方法，对资源进行下载操作，下面的实例表示在`music.qq.com`试听音乐时自动下载音频文件：


url:
```
http://*.stream.qqmusic.qq.com/*.m4a*
```
replacer(函数):
```
function (url){
  download(url)
}
```

### 导出和导入
设置页面有`导出`和`导入`两个按钮，分别可以将当前设置导出为`.bac`格式的文本文件、从`.bac`文件导入备份的设置。

**!!! 请不要随便导入未知文件，切记 !!!**

## 意见反馈
如果发现 Bug，或者对产品有其他建议，可以[新建 Issue](https://github.com/meowtec/Owl-redirector/issues/new)。
