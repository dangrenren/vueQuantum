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
          <div style="height: 350px; overflow:auto; border-top: 1px solid #ccc" v-html="content5"></div>
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
      content2: [],
      content4: {},
      content5: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    changeChatUser(val) {
      this.chatUser = val;//聊天用户名为自己点击选择的用户名
      //选择用户名后，需要去content数组里取得对应聊天用户，就是我们数组元素的touUser属性
      let content3 = this.content2.filter(itemOne => itemOne.toUser === this.chatUser);
      console.log(content3)
      this.content4 = content3[content3.length - 1]//因为刚开始没法消息时content4为空，所以浏览器端会显示messageHTML类型无法识别，不管这个
      this.content5 = this.content4.messageHTML//把保存的聊天记录显示出来
      console.log(this.content5)
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

          let changeText = stringToByte(this.text)
          let newArray = new Array();
          for (let i = 0; i < changeText.length; i++) {
            newArray.push(changeText[i])//将Int8Array类型的元素push进普通数组中
          }
          let message = {from: this.user.username, to: this.chatUser, text: newArray}
          socket.send(JSON.stringify(message));  // 将组装好的json发送给服务端，由服务端进行转发
          console.log("打印字符转字节数组==========+" + JSON.stringify(message))
          //this.messages.push({user: this.user.username, text: newArray}) 青戈写的这句话好像没用
          // 构建消息内容，本人消息
          this.createContent(null, this.user.username, this.text)
          this.text = '';
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
      //将当前用户与聊天者的聊天内容html组成对象,保存在数组中（注意，并不是仅仅当前chatting的聊天用户，
      // 而是所有与当前这个用户发送聊天消息的用户），把他们的消息构成的html保存下来到content2数组。
      let differentMessages = {
        nowUser: JSON.parse(sessionStorage.getItem("user")).username,
        toUser: remoteUser,
        messageHTML: this.content
      }
      //保存对象到content2数组
      this.content2.push(differentMessages)
      console.log(this.content2)
      //用的时候，就取出content2中符合nowUser=JSON.parse(localStorage.getItem("user"),toUser=this.chatUser的元素的Messages字段的值
      //但是两个用户的消息是多次存储的，所以数组里有两个用户很多次消息，所以我们筛选出两个用户消息的数组，最近的消息在来两个用户数组的最后一个
      let content3 = this.content2.filter(itemOne => itemOne.toUser === this.chatUser);
      console.log(content3)
      this.content4 = content3[content3.length - 1]
      console.log(this.content4)//打印，当前用户和聊天的用户最近的一个全部differentMessages消息对象
      //如果remoteUser为空（即，是自己发的消息），或者当前chatting用户与remoteUser用户一致（即时正在聊天的用户发来的消息）,就把两个人的全部消息显示出来。
      if (remoteUser === null || this.chatUser === remoteUser) {
        this.content5 = this.content4.messageHTML
      }
      console.log("我在测试")
    },
    init() {
      this.user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
      let username = this.user.username;
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://localhost:9090/imserver/" + username;
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

            //我们这里不论是不是当前聊天对象发来的，只要是服务器发来的聊天消息，我们都接受，用createContent构建html,
            // 但是只对当天聊天用户显示 两个人的聊天信息

            //所以综上，自己数组转化为字符串的解决代码为
            let str4 = data.text.substr(1, data.text.length - 2)//抽取去掉首尾[]的字符串
            let array11 = str4.split(',').map(item => parseInt(item, 10));//字符串变为数组
            let array12 = new Int8Array(array11)//转换为Int8Array
            let decoder2 = new TextDecoder('utf-8');
            let str5 = decoder2.decode(array12)

            // 构建消息内容
            _this.createContent(data.from, null, str5)

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
