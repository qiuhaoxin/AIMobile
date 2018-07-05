## AIMobile 打包到正式环境操作
替换：运行npm run build 命令，将生成在dist文件夹的文件相应替换到本地webapp/template/index.html 和 ../static/js/xx.js , ../static/css/xx.css下
替换前将以下代码考到index.html

    <script th:inline="JavaScript" charset="utf-8">  
    /*<![CDATA[*/  
        var context = [[${context}]];
        window.chatSessionId = [[${chatSessionId}]];
        var uname = [[${uname}]];
        var message=[[${message}]];
        var avatar=[[${avatar}]];
        var welcomeText=[[${welcomeText}]];
    /*]]>*/  
    </script> 
    注：这段代码应放到webpack打包生成的js文件前

    页面是经过chatbot/index 跳转的，注意 <style /> <meta /> 这类标签的闭合
    注意css,js文件的引用路径




## AIMobile 代码项目结构
   src 源码结构
   |
   |---lib 存放第三方库 
   |
   |---public 
   |
   |---services 网络请求
   |
   |---pages 存放各个页面
   |
   |---utils 工具类，包括常用的方法和云之家js-api的方法的封装
   |
   |---routes 页面之间的路由
   |
   |---reducers redux 的state管理
   |
   |---lib 第三方依赖库
   |
   |---components 页面组件
   |
   |---action  包括actionType  和 请求数据方法
   |
   |---images 图片资源
