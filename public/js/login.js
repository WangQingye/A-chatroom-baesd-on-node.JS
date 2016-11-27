/*var minGan=["你大爷", "毛泽东", "习近平", "李克强", "王岐山", "邓小平", "文革", "共产党", "爷", "日", "狗"];
var yanzheng1=false;
var yanzheng2=false;
var sexy=-1;
$(function() {
    $('#startchat').hide();

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
        if(yanzheng1){
            $('#warning').html("请选择性别");
        }
    });

    $('#nickname').click(function() {
        $('#warning').html("");
        $('#startchat').hide();
    });

    $('#sex input').click(function() {

        yanzheng2=true;
        $('#sex input').each(function(i, dom) {
            if(dom.checked) {
                sexy=i;
            }
        });
        if(sexy!= -1) {
            $('#warning').html("");
            $('#startchat').show();
        }

    });

});*/
