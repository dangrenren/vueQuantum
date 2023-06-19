<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="4">
        <el-card style="width: 300px; height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">在线用户<span style="font-size: 12px">（点击聊天气泡开始聊天）</span>
          </div>
          <div style="padding: 10px 0" v-for="user in users" :key="user.username">
            <span>{{ user.username }}</span>
            <i class="el-icon-chat-dot-round" style="margin-left: 10px; font-size: 16px; cursor: pointer"
               @click="changeChatUser(user.username)"></i> <!--修改这里，点击切换聊天用户，改变聊天信息页面，让之前聊天页空白-->
            <span style="font-size: 12px;color: limegreen; margin-left: 5px" v-if="user.username === chatUser">chatting...</span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="20">
        <div style="width: 800px; margin: 0 auto; background-color: white;
                    border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <div style="text-align: center; line-height: 50px;">
            Web聊天室（{{ chatUser }}）
          </div>
          <div style="height: 350px; overflow:auto; border-top: 1px solid #ccc" v-html="content"></div>
          <div style="height: 200px">
            <textarea v-model="text" style="height: 160px; width: 100%; padding: 20px; border: none; border-top: 1px solid #ccc;
             border-bottom: 1px solid #ccc; outline: none"></textarea>
            <div style="text-align: right; padding-right: 10px">
              <el-button type="primary" size="mini" @click="send">发送</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<!--<script src="../utils/stringToByte.js"></script> -->

<script>

import request from "@/utils/request";
import {stringToByte} from "@/utils/stringToByte";

let socket;

export default {
  name: "Im",
  data() {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      user: {},
      isCollapse: false,
      users: [],
      chatUser: '',
      //text: "",
      text: [],
      messages: [],
      content: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    changeChatUser(val) {
      this.chatUser = val;
      this.content = ''
    },
    send() {
      if (!this.chatUser) {
        this.$message({type: 'warning', message: "请选择聊天对象"})
        return;
      }
      if (!this.text) {
        this.$message({type: 'warning', message: "请输入内容"})
      } else {
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          // 组装待发送的消息 json
          // {"from": "zhang", "to": "admin", "text": "聊天文本"}

          /**
           以下为文本使用量子密钥加密

           let int8Array=stringToByte(this.text)
           let miyao="1010101011101010101110101010111010101011000101010101010101010101010101001110011110101000010110111101010101010";
           let testArray = miyao.split('').map(item => parseInt(item, 10));//字符串分割为10进制的整数数组
           * **/
          let changeText = stringToByte(this.text)
          let newArray = new Array();
          for (let i = 0; i < changeText.length; i++) {
            newArray.push(changeText[i])//将Int8Array类型的元素push进普通数组中
          }
          let message = {from: this.user.username, to: this.chatUser, text: newArray}
          /**
           console.log(changeText)
           let textTest={text:changeText}

           let decoder = new TextDecoder('utf-8');
           //let str1 = decoder.decode(textTest);
           let str2=decoder.decode(changeText)
           console.log(str2+"=========+++++")
           //js对象转为json字符串，会将{text:[119,119]}转化为{"text":{"0":119,"1":119}}
           console.log(JSON.stringify(textTest))
           let array1=[-119,119]
           let JsObject1={text:array1}
           console.log(JSON.stringify(JsObject1))
           //这里测出，我们用int8Array的时候，转化为json会出现{"0":-119,"1":119}这种情况，但是用普通的array数组却不会，所以我们将
           //int8Array转化为Array数组.
           let newArray = new Array();
           for(let i=0;i<changeText.length;i++){
              newArray.push(changeText[i])//将Int8Array类型的元素push进普通数组中
          }
           console.log(newArray)
           let JsObject2={text:newArray}
           console.log(JSON.stringify(JsObject2))//经过测试，普通Array转为JSON没有问题
           * **/


          socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
          console.log("打印字符转字节数组==========+" + JSON.stringify(message))
          this.messages.push({user: this.user.username, text: newArray})
          // 构建消息内容，本人消息
          this.createContent(null, this.user.username, this.text)
          this.text = '';
          /**
           let message = {from: this.user.username, to: this.chatUser, text: this.text}
           socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
           this.messages.push({user: this.user.username, text: this.text})
           // 构建消息内容，本人消息
           this.createContent(null, this.user.username, this.text)
           this.text = '';
           **/
        }
      }
    },
    createContent(remoteUser, nowUser, text) {  // 这个方法是用来将 json的聊天消息数据转换成 html的。
      let html
      // 当前用户消息
      if (nowUser) { // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-22\" style=\"text-align: right; padding-right: 10px\">\n" +
            "    <div class=\"tip left\">" + text + "</div>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-2\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "</div>";
      } else if (remoteUser) {   // remoteUser表示远程用户聊天消息，蓝色的气泡
        html = "<div class=\"el-row\" style=\"padding: 5px 0\">\n" +
            "  <div class=\"el-col el-col-2\" style=\"text-align: right\">\n" +
            "  <span class=\"el-avatar el-avatar--circle\" style=\"height: 40px; width: 40px; line-height: 40px;\">\n" +
            "    <img src=\"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png\" style=\"object-fit: cover;\">\n" +
            "  </span>\n" +
            "  </div>\n" +
            "  <div class=\"el-col el-col-22\" style=\"text-align: left; padding-left: 10px\">\n" +
            "    <div class=\"tip right\">" + text + "</div>\n" +
            "  </div>\n" +
            "</div>";
      }
      console.log(html)
      this.content += html;
    },

    init() {
      this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
      let username = this.user.username;
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://localhost:9091/imserver/" + username;
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data)
          let data = JSON.parse(msg.data)  // 对收到的json数据进行解析， 类似这样的： {"users": [{"username": "zhang"},{ "username": "admin"}]}
          if (data.users) {  // 获取在线人员信息
            _this.users = data.users.filter(user => user.username !== username)  // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
          } else {
            // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
            //  // {"from": "zhang", "text": "hello"}
            if (data.from === _this.chatUser) {
              _this.messages.push(data)
              // 构建消息内容
              /**
               更改青戈这里，不直接用接受到的text数据，重新编码为字符串。
               _this.createContent(data.from, null, data.text)
               * **/
                  //需要对普通数组变为int8Array才能对其用utf编码变为字符串
              let array3 = data.text
              console.log(array3)
              let array4 = [49, 49, 49]
              //let array4=new Int8Array(array3)//需要对普通数组变为int8Array才能对其用utf-8编码变为字符串,直接传对象好像不行
              console.log(array4[0])
              console.log(typeof (array4))
              let array4Plus = new Array(100, -25, 30)
              console.log(array4Plus)
              console.log(typeof (array4Plus))
              let array5 = new Int8Array(array4)
              console.log(array5)
              let decoder = new TextDecoder('utf-8');
              let str2 = decoder.decode(array5)
              console.log(str2 + "什么鬼？？？？？？")

              let array6 = new Array(data.text)
              console.log(array6)
              let array7 = new Int8Array(array6)
              console.log(array7)
              console.log("应该好了把？？？？？")

              console.log(typeof (data.text)) //打印属性类型，不出意外的话是array?我草，是String类型
              let str3 = data.text.substr(1, data.text.length - 2)//抽取去掉收尾[]的字符串
              console.log(str3)//不出意外，应该是50，50？
              console.log("没事吧，你没事吧！！!")
              let array8 = str3.split(',').map(item => parseInt(item, 10));
              console.log(array8)//不出意外，因为[]符号，会报错，或者说是把[]也算上
              console.log(typeof (array8))//object 类型
              let array9 = new Array(array8)
              console.log(typeof (array9))//看看能不能变为array类型，变不成啊，还是object类型
              let array10 = new Int8Array(array8)
              console.log(array10)//看打印的出来不？ 打印的出来！是Int8Array类型的了

              //所以综上，解决代码为
              let str4 = data.text.substr(1, data.text.length - 2)//抽取去掉首尾[]的字符串
              let array11 = str4.split(',').map(item => parseInt(item, 10));//字符串变为数组
              let array12 = new Int8Array(array11)//转换为Int8Array
              let decoder2 = new TextDecoder('utf-8');
              let str5 = decoder2.decode(array12)


              _this.createContent(data.from, null, str5)
            }
          }
        };
        //关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
    }

  }
}

</script>

<style>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
  display: inline;
}

.right {
  background-color: deepskyblue;
}

.left {
  background-color: forestgreen;
}
</style>
