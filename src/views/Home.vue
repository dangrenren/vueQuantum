<template>
  <div>
    <el-row :gutter="100">
      <el-col :span="12">
        <div id="main" style="width: 100%; height: 400px"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 100%; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';


export default {
  name: "Home",

  data() {
    return {}
  },
  mounted() {//html元素出来后再操作
    //example柱状图+折线图
    let option = {//定义一个option
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line'
        }, {
          data: [],
          type: 'bar'
        }
      ]
    };
    //usr表注册用户数量折线图
    let userChartOption = {//定义一个option
      title: {
        text: '会员注册统计',
        subtext: '趋势图',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        //data: ['对称密钥','非对称密钥','量子密钥','扩展密钥']
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'line'
        }, {
          data: [],
          type: 'bar'
        }
      ]
    };
    let secretKeyOption = {
      title: {
        text: '密钥分类下载统计',
        left: 'center',
        textStyle: {
          fontSize: 15
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['对称密钥', '非对称密钥', '量子密钥', '扩展密钥'],
        top: 25
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '对称密钥',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '非对称密钥',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '量子密钥',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '扩展密钥',
          type: 'line',
          stack: 'Total',
          data: [320, 332, 301, 334, 390, 330, 320]
        }
      ]
    };
    //饼状图
    let pieOption = {
      title: {
        text: '密钥需求分类统计',
        subtext: '需求占比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            {value: 1048, name: '认证服务器'},
            {value: 735, name: '关联成像'},
            {value: 580, name: '云盘文件加密'},
            {value: 484, name: '即时通讯'},
            {value: 300, name: '密钥分发重构'}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    /**
     let chartDom = document.getElementById('main');
     let myChart = echarts.init(chartDom);
     //设置option
     this.request.get("/echarts/example").then(res=>{
      option.xAxis.data=res.data.x
      option.series[0].data=res.data.y
      option.series[1].data=res.data.y
      option && myChart.setOption(option);
    })
     * **/

    /** 用户注册统计
     let userChartDom = document.getElementById('main');
     let myUserChart = echarts.init(userChartDom);
     this.request.get("/echarts/members").then(res=>{
      userChartOption.series[0].data=res.data
      userChartOption.series[1].data=res.data
      userChartOption && myUserChart.setOption(userChartOption);
    })
     * **/
        //密钥种类下载统计
    let secretKeyDom = document.getElementById('main');
    let mySecretKeyChart = echarts.init(secretKeyDom);
    secretKeyOption && mySecretKeyChart.setOption(secretKeyOption);

    //饼状图设置
    let pieChartDom = document.getElementById('pie');
    let myPieChart = echarts.init(pieChartDom);
    pieOption && myPieChart.setOption(pieOption);
  },
  methods: {}
}

</script>

<style scoped>

</style>