<template>
  <div class="indexwrap">
    <div class="boxwrap">
    <div class="box">
      <h2>商品总览</h2>
      <ul>
        <li>
          <h3>100</h3>
          <p>已下架</p>
        </li>
        <li>
          <h3>400</h3>
          <p>已上架</p>
        </li>
        <li>
          <h3>50</h3>
          <p>库存紧张</p>
        </li>
        <li>
          <h3>500</h3>
          <p>全部商品</p>
        </li>
      </ul>
    </div>
    <div class="box">
      <h2>用户总览</h2>
      <ul>
        <li>
          <h3>100</h3>
          <p>已下架</p>
        </li>
        <li>
          <h3>400</h3>
          <p>已上架</p>
        </li>
        <li>
          <h3>50</h3>
          <p>库存紧张</p>
        </li>
        <li>
          <h3>500</h3>
          <p>全部商品</p>
        </li>
      </ul>
    </div>
    </div>
        <div
          id="main"
          style="width: 60%; height: 350px; margin-top: 50px"
        ></div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      charts: "",
      opinionData: ["550", "610", "480", "291", "390", "702", "810"],
    };
  },
  methods: {
    drawLine(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["近一周订单数量"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.opinionData,
            type: "line",
            name: "近一周订单数量",
            stack: "总量",
          },
        ],
      });
    },
  },
  mounted() {
    this.drawLine("main");
  },
};
</script>
<style lang="less">
.boxwrap {
  display: flex;
  justify-content: space-around;
  .box {
    width: 500px;
    border: 1px solid black;
    float: left;
    margin-top: 40px;
    h2 {
      font-size: 14px;
      height: 40px;
      width: 100%;
      background: #f2f6fc;
      line-height: 40px;
      padding-left: 15px;
      box-sizing: border-box;
    }
    ul{
      display: flex;
      justify-content: space-around;
      text-align: center;
      padding: 15px 0;
      h3{
        color: red;
        font-size:18px;
        font-weight: 400;
      }
      p{
        font-size:14px;
        margin-top: 5px;
      }
    }
  }
}
</style>