var http=require("http");   //引入http模块

var express=require("express"); //引入express模块

var app=express();  //创建一个express程序

var httpServer=http.createServer(app);  //创建web服务器

var socketServer=require("./socketserver3.js");  //引入自定义的socketserver.js模块，并调用其listen方法
socketServer.listen(httpServer);

app.use(express.static("public"));  //指定静态资源处理的中间件

var port=8888;  //web服务器监听端口
httpServer.listen(8888,function(){
    console.log("服务器正运行在端口："+port);
});


