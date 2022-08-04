## 简要介绍
使用命令`npm run build`or`node main.js`将源程序代码转化为目标代码  
目录结构说明：  
src是源程序代码，包括html和js分别是UI线程代码和逻辑线程代码  
dist是src的目标代码，名字分别对应  
helper.js是辅助代码，会被整合到前端代码中  
module.js 是基本的模块加载函数，未使用  
index.html打开后就可以看到小程序  
## 使用方法
* 在VS code中安装Live Server插件
* 在VS code中右键home.html，选择`open with liver server`
* 按照界面提示操作

## 设计思路说明
由于时间精力有限，目前完成的内容包括：
* 实现双线程加载模型
* 了解worker相关概念
* 实现基本的模块加载函数
* 完成双线程通信
* 实现基于vdom的渲染框架
* 实现小程序支持的if语句
* 实现基础的组件渲染
* 构建了简单的小程序渲染和逻辑抽象，并且可以运行一个RGB对照的小程序，打开index.html即可
总体的设计思路是，UI线程只负责渲染和发送事件，逻辑线程则负责计算和返回数据。
通过自定义babel组件，为源程序添加一系列必要的代码，比如worker，helper，data等，来实现小程序的双线程通信。细节可以看main.js