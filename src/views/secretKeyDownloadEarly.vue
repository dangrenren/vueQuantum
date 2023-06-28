<template>
  <div>
    <div style="cursor: pointer; font-size: 25px">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" plain @click="download0">下载->认证</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="success" plain @click="download1">下载->鬼成像</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="danger" plain @click="download2">下载->云盘加密</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="warning" plain @click="download3">下载->分发重构</el-button>
          </div>
        </el-col>
        <!-- 用eccrypto库 -->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="warning" plain @click="clickDH">打印->DH协商密钥1</el-button>
          </div>
        </el-col>
        <!--用eccrypto-js 库-->
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="warning" plain @click="eccryptoJS">打印->DH协商密钥2</el-button>
          </div>
        </el-col>

      </el-row>
    </div>

    <div>
      <el-row>
        <div style="top: 50px;color: #dd6161; margin-top: 50px"><i class="el-icon-user-solid"/>
          <i>当不同用途需要的密钥并不是唯一的种类时，（例如云盘加密时需要量子密钥也需要普通对称密钥）除了提供按钮方式，也可以使用下拉表单的方式，选择密钥用途，再选择密钥种类，点击下载，下载对应需求的密钥</i>
        </div>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple-dark"> dd</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-upload
              class="upload-demo"
              :action="'http://'+serverIp+':8091/file/upload'"
              :before-upload="beforeUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">不能上传dll/exe文件，且不能超过20MB</div>
          </el-upload>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" @click="download">下载文件</el-button>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 50px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="目的">
          <el-select v-model="formInline.purpose" placeholder="选择目的">
            <el-option label="认证服务器" value="sure"></el-option>
            <el-option label="云盘加密" value="secret"></el-option>
            <el-option label="关联成像" value="relation"></el-option>
            <el-option label="分发重构" value="refresh"></el-option>
            <el-option label="其他目的" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密钥种类">
          <el-select v-model="formInline.category" placeholder="选择密钥种类">
            <el-option label="对称密钥" value="AES"></el-option>
            <el-option label="非对称密钥" value="RSA"></el-option>
            <el-option label="量子密钥" value="quantum"></el-option>
            <el-option label="扩展密钥" value="extendSecretKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">下载</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--京东播放视频组件(取消了)
    <div>
       <nut-video :sources="sources" :options="options" @play="play" @pause="pause" @playend="playend"> </nut-video>
     </div>
    -->
    <div><!--京东抽奖组件-->
      <nut-luckdraw
          class="drawTable"
          ref="luckDrawPrize"
          :luck-width="luckWidth"
          :luck-height="luckheight"
          :prize-list="prizeList"
          :turns-number="turnsNumber"
          :turns-time="turnsTime"
          :prize-index="prizeIndex"
          :style-opt="styleOpt"
          @end-turns="endTurns"
      >
        <template slot="item" slot-scope="scope">
          <div class="drawTable-name">{{ scope.item.prizeName }}</div>
          <div class="drawTable-img">
            <img :src="scope.item.prizeImg">
          </div>
        </template>
      </nut-luckdraw>
      <div @click="startTurns" class="pointer" :style="pointerStyle"></div>
    </div>

  </div>
</template>

<script>
import {DH} from "@/utils/DH";
import {Buffer} from "buffer";
import eccrypto from "eccrypto";

window.Buffer = Buffer;
//import eccrypto from "eccrypto";用这种方式导入，会显示异步组件，无法用router
import * as eccryptoJS from 'eccrypto-js';
import {serverIp} from "../../public/config";

export default {
  name: "secretKeyDownload",
  data() {
    return {
      serverIp: serverIp,
      formInline: {
        purpose: '',
        category: ''
      },
      //以下为京东抽奖数据
      // 转盘大小
      luckWidth: '250px',
      luckheight: '250px',
      // 转盘指针图片样式
      pointerStyle: {
        width: '80px',
        height: '80px',
        backgroundImage: 'url("https://img11.360buyimg.com/imagetools/jfs/t1/89512/11/15244/137408/5e6f15edEf57fa3ff/cb57747119b3bf89.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      },
      // 奖品列表
      prizeList: [
        {
          id: 'xiaomi',
          prizeName: '小米手机',
          prizeImg: 'https://img14.360buyimg.com/imagetools/jfs/t1/104165/34/15186/96522/5e6f1435E46bc0cb0/d4e878a15bfd9362.png'
        },
        {
          id: 'blue',
          prizeColor: 'rgb(251, 219, 216)',
          prizeName: '蓝牙耳机',
          prizeImg: 'https://img13.360buyimg.com/imagetools/jfs/t1/91864/11/15108/139003/5e6f146dE1c7b511d/1ddc5aa6e502060a.jpg'
        },
        {
          id: 'apple',
          prizeName: 'apple watch',
          prizeImg: 'https://img11.360buyimg.com/imagetools/jfs/t1/105385/19/15140/111093/5e6f1506E48bd0dfb/829a98a8cdb4c27f.png'
        },
        {
          id: 'fruit',
          prizeColor: 'rgba(246, 142, 46, 0.5)',
          prizeName: '迪士尼苹果',
          prizeImg: 'https://img11.360buyimg.com/imagetools/jfs/t1/108308/11/8890/237603/5e6f157eE489cccf1/26e0437cfd93b9c8.png'
        },
        {
          id: 'fish',
          prizeName: '海鲜套餐',
          prizeImg: 'https://img14.360buyimg.com/imagetools/jfs/t1/90507/38/15165/448364/5e6f15b4E5df0c718/4bd4c3d375eec312.png'
        },
        {
          id: 'thanks',
          prizeName: '谢谢参与',
          prizeImg: 'https://img11.360buyimg.com/imagetools/jfs/t1/96116/38/15085/5181/5e6f15d1E48e31d30/71353b61dff705d4.png'
        }
      ],
      turnsNumber: 5, // 转动圈数
      turnsTime: 5,// 转动时间：S
      styleOpt: {
        prizeBgColors: ['rgb(255, 231, 149)', 'rgb(255, 247, 223)', 'rgb(255, 231, 149)', 'rgb(255, 247, 223)', 'rgb(255, 231, 149)', 'rgb(255, 247, 223)'],
        borderColor: '#ff9800',
      },
      prizeIndex: -1, // 中奖奖品的index
      lock: false,// 防止多次连续点击抽奖
      num: 5,// 抽奖次数,根据需求定义
    }
  },
  mounted() {
    console.log("我服啦")
    // DH();
  },
  methods: {

    async eccryptoJS() {
      const keyPairA = eccryptoJS.generateKeyPair();
      const keyPairB = eccryptoJS.generateKeyPair();

      const sharedKey1 = await eccryptoJS.derive(
          keyPairA.privateKey,
          keyPairB.publicKey
      );

      const sharedKey2 = await eccryptoJS.derive(
          keyPairB.privateKey,
          keyPairA.publicKey
      );
      console.log(sharedKey1.toString('hex') === sharedKey2.toString('hex'))
    },

    clickDH() {
      let eccrypto = require("eccrypto")
      let privateKeyA = eccrypto.generatePrivate();
      console.log(privateKeyA)
      let publicKeyA = eccrypto.getPublic(privateKeyA);
      let privateKeyB = eccrypto.generatePrivate();
      let publicKeyB = eccrypto.getPublic(privateKeyB);
      console.log(publicKeyB)
      eccrypto.derive(privateKeyA, publicKeyB).then(x => console.log(x))
      eccrypto.derive(privateKeyB, publicKeyA).then(y => console.log(y))
      //console.log(JSON.stringify(privateKeyA))
      let int8Array1 = new Int8Array([236, 59, 69, 66, 22, 245, 81, 15, 220, 94, 68, 247, 103, 158, 189, 103, 206, 104, 180, 113, 116, 134, 254, 249, 186, 134, 71, 227, 44, 109, 186, 116])
      let buffer1 = new Buffer(int8Array1)
      let int8Array2 = new Int8Array([4, 209, 233, 88, 88, 177, 198, 173, 104, 218, 6, 193, 0, 38, 8, 21, 228, 86, 162, 20, 105, 55, 168, 123, 5, 130, 173, 177, 55, 228, 164, 241, 199, 129, 95, 47, 9, 60, 51, 70, 32, 36, 193, 203, 82, 106, 107, 80, 57, 37, 154, 143, 52, 188, 129, 210, 68, 239, 137, 9, 245, 219, 187, 236, 19])
      let buffer2 = new Buffer(int8Array2)
      eccrypto.derive(buffer1, buffer2).then(buffer3 => console.log(buffer3))
      //let DHString=JSON.stringify(eccrypto.derive(privateKeyA, publicKeyB))
      // console.log( DHString)
    },
    download0() {
      this.$message.error("后台接口未开发")
    },
    download1() {
      this.$message.error("后台接口未开发")
    },
    download2() {
      this.$message.error("后台接口未开发")
    },
    download3() {
      this.$message.error("后台接口未开发")
    },
    onSubmit() {
      this.$message.error("后台接口未开发")
      console.log('submit!' + this.formInline.purpose + '  ' + this.formInline.category);
    },
    play(elm) {
      console.log('play', elm)
    },
    pause(e) {
      console.log('pause')
    },
    playend(e) {
      alert('播放结束')
    },
    startTurns() {
      if (!this.canBeRotated()) {
        return false;
      }
      this.lock = true;
      // 此为模拟随机数字，这里可以接受后台中奖信息
      const index = Math.floor(Math.random() * this.prizeList.length);
      // 成功后抽奖次数减1
      this.num--;
      // 中奖奖品的index
      this.prizeIndex = index;
      // 调用组件的方法，使转盘转动并停留在中奖奖品的那个扇形区域
      this.$refs.luckDrawPrize.rotate(index);
    },
    endTurns() {
      this.$dialog({
        content: `恭喜中奖！！！${this.prizeList[this.prizeIndex].prizeName}`,
        noCloseBtn: false,
        noOkBtn: true,
        cancelBtnTxt: "我知道了"
      });
      this.lock = false;
    },
    canBeRotated() {
      if (this.num <= 0) {
        this.$dialog({
          content: `已经没有次数了,继续加油赚积分吧！`,
          noCloseBtn: false,
          noOkBtn: true,
          cancelBtnTxt: "我知道了"
        });
        return false;
      }
      if (this.lock) {
        return false;
      }
      return true;
    },

    handleAvatarSuccess(response) {
      //可以上传了，但是成功没有弹窗，需要写个弹窗。
      //console.log('OK'+response.data())
      this.$message('成功上传');
    },
    beforeUpload(file) {
      if (file) {
        const size = file.size / 1024 / 1024 < 100
        if (!size) {
          this.$message.error('上传文件大小不能超过 100MB!')
          return false
        }
        return file
      }
    },
    download() {
      //window.open("http://localhost:9090/file/a07e70f7814147ee992fbb3b95e3728f.jpeg")
      //用open会打开新的浏览器窗口，而使用href不会，比较好一点。
      window.location.href = "http://"+serverIp+":8091/file/a07e70f7814147ee992fbb3b95e3728f.jpeg"
    }

  }
}
</script>

<style scoped>
el-row {
  margin-bottom: 50px;
}

el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
  margin-bottom: 50px;
  margin-top: 100px;
  margin-left: 50px;

  margin-right: 50px;
  text-align: center;
}

.demo-form-inline {
  margin-left: 250px;
}
</style>