var socketio=require("socket.io");  //引入socket.io模块

module.exports.listen=function(httpServer) {     //暴露函数listen给调用web服务器模块
    var io=socketio.listen(httpServer);     //让socket.io模块监听httpServer(绑定)


    var userlist=[];
    //服务器端会监听客户端的socket链接请求——会触发一个名为"connection"的事件
    //每当来一个客户端请求，服务端就会创建一个socket，由该socket负责和这个客户端通信
    io.on("connection", function(socket) {
        var user={};
        var socketID=socket.id.substring(2);
        user.id=socketID;
        console.log("有客户端请求：" + socket.id+" 上线时间："+(new Date()).toLocaleString());
        socket.emit("welcome", {message: "欢迎你，新朋友！"});

        //监听新用户登录聊天室的事件(昵称)
        socket.on("user_enter", function(data) {
            console.log("新用户：" + data.nickname);
            user.name=data.nickname;
            user.gender=data.gender;
            userlist[userlist.length]=user;
            socket.broadcast.emit("userlist",userlist);

            socket.nickname=data.nickname;  //将用户的昵称保存到socket中

            //把新用户登录信息广播给所有在线用户
            //socket.broadcast会将消息广播给除了自己之外的所有用户
            socket.broadcast.emit("user_entered", {nickname: data.nickname,gender:data.gender});

            //向当前这个客户端发送一个已登录信息
            socket.emit("my_entered", user);

            socket.emit("userlist",userlist);
        });

        //监听用户的聊天内容
        socket.on("message", function(data) {
            //console.log(socket.nickname + "说：" + data.content);

            //如果客户端发送的是聊天内容
            if(data.type=="userMessage") {

                //1）将该聊天内容转发给所有在线用户——携带上发言者的昵称
                //将原来保存在socket中的昵称取出来，再储存到data中
                data.nickname=socket.nickname;
                data.from=socketID;
                socket.broadcast.send(data);

                //2）将该聊天内容发回给自己
                data.nickname="我";
                data.type="myMessage";
                socket.send(data);
            }
        });

        //监听用户列表双击事件
        socket.on("userdblclick",function(data){
            console.log("双击了用户"+data+" 双击时间："+(new Date()).toLocaleString());
        });

        //监听客户端离开的消息
        socket.on("disconnect", function() {
            console.log(socket.nickname + "离开了聊天室。"+" 离开时间："+(new Date()).toLocaleString());
            socket.broadcast.emit("user_leave", {nickname: socket.nickname});
            for(var i=0;i<userlist.length;i++){
                if(userlist[i].id==socketID){
                    userlist.splice(i,1);
                }
            }
            for(var index in userlist){
                console.log("目前还在聊天室的人："+userlist[index].name);
            }
            socket.broadcast.emit("userlist",userlist); 

        })
    });
};


