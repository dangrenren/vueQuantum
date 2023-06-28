<template xmlns:el-col="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <div style="cursor: pointer; font-size: 25px">
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" plain @click="download0">下载->认证</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="success" plain @click="download1">下载->鬼成像</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="danger" plain @click="download2">下载->云盘加密</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="warning" plain @click="download3">下载->分发重构</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-show="isUpload" style="margin-top:50px;display: flex; align-items: center;">
      <el-row>
        <el-col :span="20">
          <el-upload
              class="upload-demo"
              :action="'http://'+serverIp+':8091/file/upload'"
              :before-upload="beforeUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false">
            <el-button size="small" type="primary">管理员上传密钥文件</el-button>
            <div slot="tip" class="el-upload__tip">不能上传dll/exe文件，且不能超过20MB</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>

    <div style="margin-top: 50px">
      <el-row type="flex">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <nut-button size="large" type="primary" @click="lottory">抽奖</nut-button>
          </div>
        </el-col>
        <el-col :span="22">
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
          <el-form-item label="密钥大小">
            <el-select v-model="formInline.count" placeholder="选择密钥大小">
              <el-option label="1kb" value="quantum1"></el-option>
              <el-option label="100kb" value="quantum2"></el-option>
              <el-option label="1M" value="quantum3"></el-option>
              <el-option label="10M" value="quantum4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">下载</el-button>
          </el-form-item>
        </el-form>
        </el-col>
      </el-row>
    </div>

    <div v-if="showLottory">
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
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "secretKeyDownload",
  data() {
    return {
      serverIp: serverIp,
      showLottory: false,
      isUpload: false,
      formInline: {
        purpose: '',
        category: '',
        count: ''
      },
      //以下为京东抽奖数据
      // 转盘大小
      luckWidth: '350px',
      luckheight: '350px',
      // 转盘指针图片样式
      pointerStyle: {
        width: '100px',
        height: '100px',
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
    this.displayUpload()
  },
  methods: {
    displayUpload() {
      let item = localStorage.getItem("user");
      if(item){//如果有值
        let user = JSON.parse(item);
        if (user.username == 'dangrenren') {
          this.isUpload = true
        } else {
          this.isUpload = false
        }
      }
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
      if (this.formInline.purpose == '' || this.formInline.category == ''||this.formInline.count == '') {
        this.$message.error("请确认全部选项")
      } else {//不为空,开始下载
        let fileName=this.formInline.count
        window.location.href = "http://"+serverIp+":8094/file/"+fileName+".txt"
      }
      //console.log('submit!' + this.formInline.purpose + '  ' + this.formInline.category+'  '+this.formInline.count);
    },
    lottory() {
      this.showLottory = !this.showLottory;//点击抽奖按钮，显示抽奖转盘。再次点击，隐藏转盘。
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
        content: `恭喜中奖！！！${this.prizeList[this.prizeIndex].prizeName}。  您的运气太棒了！详情联系负责人 13353273960`,
        noCloseBtn: false,
        noOkBtn: true,
        cancelBtnTxt: "我知道了"
      });
      this.lock = false;
      //抽一次奖后关掉抽奖界面
      this.showLottory = false;
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
      window.location.href = "http://"+serverIp+":8094/file/testDownload.txt"
    }

  }
}
</script>

<style scoped>

.demo-form-inline {
  margin-left: 250px;
}

.app-container {
  /* background-color: #f5f5f5;  设置背景颜色 */
  background: linear-gradient(to bottom, #ffffff, #f5f5f5);
  padding: 20px; /* 设置内边距，调整布局 */
  display: flex; /* 使用弹性布局 */
  flex-direction: column; /* 垂直排列子元素 */
  align-items: center; /* 在主轴上居中对齐 */
  justify-content: center; /* 在交叉轴上居中对齐 */

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}
</style>