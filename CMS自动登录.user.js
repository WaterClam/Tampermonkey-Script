// ==UserScript==
// @name         CMS自动登录
// @namespace    http://cms.cntv.cn/
// @version      0.1
// @description  CMS跳过验证码，自动登录。需要在脚本中设置用户名和密码。
// @author       Helory
// @match        http://cms.cntv.cn/
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function newlogin(Jump){
        var loginName = $("#userName").val();
        var passWord = $("#passWord").val();
        var certCode = $("#certCode").val();
        var returnUrl = $("#url").val();
        var cookie = "0";
        var browser=checkBrowser();
        $("#message").html("");
        $("input:checkbox[type=checkbox][checked]").each(function(i,item){
            cookie = $(this).attr("value");
        });
        if(loginName=='用户名'){
            $("#message").html("请输入用户名！");
            return;
        }
        if(passWord=='' || passWord.length<1){
            $("#message").html("请输入密码！");
            return;
        }
        //var ss = '<%=session.getAttribute["certCode"] %>';
        var url = "/CMS/permission/loginajaxUserLoginAction.action";
        $("#message").html("正在验证 请稍后...！");
        if(Jump){
            if(certCode==''||certCode.length<1){
                $("#message").html("请输入验证码！");
                return;
            }
            $.ajax({url:url,async: false,dataType: "json",type:"POST",data: "loginName="+loginName+"&passWord="+passWord+"&cookie="+cookie+"&url="+returnUrl+"&browser="+browser,
                    success:function(data, textStatus){
                        if(data.message=='certCodeError'){
                            $("#message").html("验证码错误！");
                        }else
                            if(data.message=='notUserError'){
                                $("#message").html("该用户不存在！");
                            }else if(data.message=='isSSOUser'){
                                window.parent.location = "http://soa.cntv.net/GetAccess/ResourceList";
                                //$("#message").html("您是单点登录用户！请点击后面的链接！<a style='font-size:14px;color:#ff0' href='http://soa.cntv.net/auth/Login'>SSO登录</a>");
                            }else if(data.message=='pwError'){
                                $("#message").html("您输入的密码错误！");
                            }else if(data.message=='pwError2'){
                                $("#message").html("您的用户已经被停用！请联系系统管理员");
                            }else if(data.message=='OK'){
                                if(data.url!=null && Jump){
                                    window.location = "/CMS"+data.url;
                                }else if(Jump){
                                    window.parent.location = "/CMS/cmsMain.jsp";

                                }else{
                                    window.parent.closeLogin();
                                }
                            }
                    }});
        }else{
            $.ajax({url:url,async: false,dataType: "json",type:"POST",data: "loginName="+loginName+"&passWord="+passWord+"&cookie="+cookie+"&url="+returnUrl+"&browser="+browser,
                    success:function(data, textStatus){
                        if(data.message=='certCodeError'){
                            $("#message").html("验证码错误！");
                        }else
                            if(data.message=='notUserError'){
                                $("#message").html("该用户不存在！");
                            }else if(data.message=='pwError'){
                                $("#message").html("您输入的密码错误！");
                            }else if(data.message=='pwError2'){
                                $("#message").html("您的用户已经被停用！请联系系统管理员");
                            }else if(data.message=='OK'){
                                if(data.url!=null && Jump){
                                    window.location = "/CMS"+data.url;
                                }else if(Jump){
                                    window.parent.location = "/CMS/cmsMain.jsp";

                                }else{
                                    window.parent.closeLogin();
                                }
                            }
                    }});
        }
    }
    var oldFunction = unsafeWindow.login;
    unsafeWindow.login = function (text) {
        //alert('Hijacked!');
        newlogin(true);
        //return oldFunction(text);
    };
    var username = document.getElementById('userName'); //得到元素， userName为元素id
    username.value = 'username'; //改变元素内容
    var passd = document.getElementById('passWord');
    passd.value = 'passd';
    var certCode = document.getElementById('certCode');
    certCode.value = 'cert';
    var Login = document.getElementById('submit'); //获取想要提交的按钮
    Login.click(); //提交
})();
