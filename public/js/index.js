var minGan=["你大爷", "毛泽东", "习近平", "李克强", "王岐山", "邓小平", "文革", "共产党", "爷", "日", "狗"];
var yanzheng1=false;
var sexy=0;

$(function() {
    $('#nickname').focus();
    $('#nickname').blur(function() {
        var val="";
        yanzheng1=true;
        var flag=true;
        val=$(this).val();
        if(val=="") {
            $('#warning').html("昵称不能为空");
            yanzheng1=false;
            $(this).focus();
        } else {
            for(var i in minGan) {
                if(minGan[i].indexOf(val)!= -1||val.indexOf(minGan[i])!= -1) {
                    flag=false;
                }
            }
            if(!flag) {
                $(this).focus();
                yanzheng1=false;
                $('#warning').html("你的昵称有敏感词，请重新输入昵称");
            }
        }
        if(yanzheng1) {
            //$('#warning').html("请选择性别");
            $("#startchat")[0].disabled="";
        }
    });

    $('#nickname').click(function() {
        $('#warning').html("");
    });

    $('#sex input').click(function() {

        $('#sex input').each(function(i, dom) {
            if(dom.checked) {
                sexy=i;
            }
        });
        $('#warning').html("");
    });


    var clientSocket=io();
    var authority="public";
    $('#qunliao').click(function() {
        $('#messages').show().prev().hide();
        $('#say').html("聊天室");
        authority="public";
        $(this).css("background-color", "transparent");
        $('.winlist').css("background-color", "#3990b2");
    });
    clientSocket.on("welcome", function(data) {
        //alert(data.message);
    });

    $('#startchat').click(function() {
        var nickname=$('#nickname').val();

        clientSocket.emit("user_enter", {nickname: nickname, gender: sexy});

        clientSocket.on("user_entered", function(data) {
            //alert(data.nickname + "进入了聊天室");
            var content='<div class="systemMessage">[系统消息]欢迎<span class="nickname">' + data.nickname + '</span>进入聊天室！</div>';
            $("#messages").append(content);
        });

        clientSocket.on("user_leave", function(data) {
            var content='<div class="systemMessage">[系统消息]<span class="nickname">' + data.nickname + '</span>离开了聊天室！</div>';
            $("#messages").append(content);
        });

        clientSocket.on("my_entered", function(user) {
        	var content7='<div class="systemMessage">[系统消息]您已进入聊天室，请文明发言!</div>';
            		$("#messages").append(content7);
            //alert("您已进入聊天室，请文明发言");
            $("#welcome").hide();
            $("#chatroom").show();

            $('body').css("background", "url(../images/bg.jpg)");
            $('body').css("background-size", "cover");

            //显示一个系统欢迎消息
            var content='<div class="systemMessage">[系统消息]您已进入聊天室。请遵纪守法，否则负法律责任。</div>';
            $("#messages").append(content);
            //alert("您的id:"+user.id+",您的昵称:"+user.name);

            //绑定发送消息按钮事件
            $("#send-btn").click(function() {
                var message=$("#message").val();
                if(message=="") {
                	var content6='<div class="systemMessage">[系统消息]发送消息不能为空！</div>';
            		$("#messages").append(content6);
                  
                    return;
                }
                var data={
                    type: "userMessage",
                    content: message,
                    target: authority,
                    gender: sexy
                };
                clientSocket.send(data);
                $("#message").val("");
            });

            //当按下Enter键时，直接发送聊天内容
            $("#message").keydown(function(e) {
                //如果用户按下的是Enter键，才发送聊天内容
                if(e.keyCode==13) {
                    var message=$("#message").val();
                    if(message=="") {
                        var content6='<div class="systemMessage">[系统消息]发送消息不能为空！</div>';
            			$("#messages").append(content6);
                        return;
                    } else {
                        $("#send-btn").click();
                    }
                    //模拟send-btn按钮的单击操作，触发send-btn按钮的单击事件

                }
            });

            //客户端监听聊天信息：有两种:userMessage, myMessage;
            clientSocket.on("message", function(data) {
                //alert(data.gender);
                //将消息显示在聊天窗口
                if(data.type=="userMessage") {
                    var content='<div class="' + data.type + '"><img src="../images/sex' + data.gender + '.png">' +
                        '<span class="nickname">[ ' + data.nickname +
                        ']说:</span><p>' + data.content +
                        '</p></div>';

                    if(data.target=="public") {
                        $("#messages").append(content);
                    } else if(user.id==data.target) {
                        //alert("此消息是发送给我的,消息来自："+data.from+"////"+data.nickname);
                        var sid="#" + data.from;
                        $(sid).dblclick();
                        $(sid).css("background-color", "orange");
                        $(sid + "_win").append(content);
                    }
                } else {
                    var content='<div class="' + data.type + '"><p>' + data.content +
                        '</p><span class="nickname"> ' + ':说[' + data.nickname +
                        ']' +
                        '</span><img src="../images/sex' + data.gender + '.png"></div>';

                    if(data.target=="public") {
                        $("#messages").append(content);
                    } else {
                        //alert("此消息是发送给我的,消息来自："+data.from+"////"+data.nickname);
                        var sid="#" + data.target;
                        //$(sid).dblclick();
                        $(sid).css("background-color", "orange");
                        $(sid + "_win").append(content);
                    }
                }

                //将聊天窗口向上卷动
                $("#messages").scrollTop($("#messages").prop('scrollHeight'));
                var windows222=document.getElementsByClassName("windows222");
                for(var i=0; i<windows222.length; i++) {
                    $(windows222[i]).scrollTop($(windows222[i]).prop('scrollHeight'));
                }
            });

            clientSocket.on("userlist", function(data) {
                $('#rside').empty();
                $('#online').html("在线人员( " + data.length + " 人)");
                for(var i=0; i<data.length; i++) {
                    if(user.id==data[i].id){
                        var content='<div id="' + data[i].id + '" class="userlist">' + data[i].name + '[我]</div>';
                    }else{
                        var content='<div id="' + data[i].id + '" class="userlist">' + data[i].name + '</div>';
                    }
                    
                    $('#rside').append(content)
                }

                $('.userlist').dblclick(function() {
                    //alert(this.id);
                    if(this.id!=user.id) {
                        authority=this.id;
                        $('#say').html("与 " + $(this).html() + " 聊天中");
                    }
                    clientSocket.emit("userdblclick", this.id);

                    var divs=$('#siliao>div');

                    var flag=true;
                    for(var i=0; i<divs.length; i++) {

                        if($(divs[i]).attr("id")==this.id + "_win") {
                            // alert("该窗口已经存在");
                            flag=false;
                            break;
                        }
                    }
                    if(flag&&(this.id!=user.id)) {

                        var content='<div id="' + this.id + '_win" class="windows222"></div>';
                        $("#siliao").append(content);
                        var divs=$('#siliao>div');

                        var content2='<div id="' + this.id + '_w" class="winlist">' + $(this).html() + '</div>';
                        $('#aside').append(content2);
                        $('.winlist').click(function() {
                            var listID=$(this).attr("id") + "in";
                            var winID=listID.substr(0, listID.lastIndexOf("_"));
                            authority=winID;
                            $('#' + listID).parent().show();
                            $('#' + listID).show().siblings().hide();
                            $('#say').html("与 " + $(this).html() + " 聊天中");
                            $(this).css("background-color", "transparent").siblings().css("background-color", "#3990b2");
                            $('#qunliao').css("background-color", "#3990b2");
                        })
                    }

                    var listID2=$(this).attr("id") + "_win";
                    $('#' + listID2).parent().show();
                    $('#' + listID2).show().siblings().hide();

                    var listID3=$(this).attr("id") + "_w";
                    $('#' + listID3).css("background-color", "transparent").siblings().css("background-color", "#3990b2");
                    $('#qunliao').css("background-color", "#3990b2");
                });


            })


        });
    })
});