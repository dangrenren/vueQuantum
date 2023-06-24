<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1;">
      <span :class="collapseBtnClass" style="cursor: pointer; font-size: 18px" @click="collapse"></span>
      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
        <!-- 插值表达式内部，可以放置变量或者表达式或者函数 -->
        <!--当vue2使用vuex4时，用上面的这行插值表达式代码会报错，使整个header组件无法显示。
        vuex4无法获取state数据，解决方法换vuex版本npm uinstall vuex后，npm i vuex@3.6.2-->
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 150px; cursor: pointer;text-align:right">
      <div style="display: inline-block">
        <img src="../images/userImages/renshu@2x.png" alt=""
             style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
        <span>{{ user.username }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link to="/person">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    user: Object
    //collapse:Function
    //用props传值时，与使用this.$emit不同。manage.vue要写成：collapse="collapse"
  },
  computed: {
    currentPathName() {
      return this.$store.state.currentPathName;//需要监听的数据
    }
  },
  data() {
    return {}
  },

  methods: {
    collapse() {
      this.$emit("asideCollapse")//this.$emit是子组件向父组件传值，Manage.vue里要用@asideCollapse
    },
    logout() {
      this.$router.push("/login")
      //this.$router.push('Login') 用路由path或者name都可以
      localStorage.removeItem("user")
      localStorage.removeItem("menus")
      this.$message.success("成功退出")
    }
  },

  watch: {// 侦听器以函数的形式定义，函数名称就是监视的数据的名称，参数就是数据变化后的新值
    currentPathName(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style scoped>

</style>


