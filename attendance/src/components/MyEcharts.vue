<template>
  <div class="echat-attend">
    <!-- 图形统计 -->
    <div class="left echart">
      <ECharts :options="lineOptions" :auto-resize="true"></ECharts>
    </div>
    <div class="right echart">
      <ECharts :options="pieOptions" :auto-resize="true"></ECharts>
    </div>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legend";

export default {
  name: "myEcharts",
  data() {
    return {
      // orgOptions: {}
    };
  },
  components: {
    ECharts
  },
  props: {
    theClass: Object,
    x_data: Array
  },
  computed: {
    lineOptions: function() {
      return {
        grid: {
          top: 80
        },
        title: {
          text:
            this.theClass.course_name +
            "(" +
            this.theClass.course_time.join("|") +
            ")", //课程名称
          subtext: "课堂考勤统计" //课程时间
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: "right",
          data: ["正常", "迟到", "旷课", "请假"]
        },
        xAxis: {
          name: "第x堂课",
          type: "category",
          boundaryGap: false,
          data: this.x_data
        },
        yAxis: {
          name: "人数",
          type: "value"
        },
        series: [
          {
            name: "总人数",
            type: "line",
            smooth: true,
            data: new Array(this.theClass.times.length).fill(
              this.theClass.total
            ) //建立一个长度为x次的课堂，值为总人数，作为参考值
          },
          {
            name: "正常",
            type: "line",
            smooth: true,
            data: this.theClass.times.map(
              v => this.theClass.total - v.late - v.leave - v.truant
            )
          },
          {
            name: "迟到",
            type: "line",
            smooth: true,
            data: this.theClass.times.map(v => v.late)
          },
          {
            name: "旷课",
            type: "line",
            smooth: true,
            data: this.theClass.times.map(v => v.truant)
          },
          {
            name: "请假",
            type: "line",
            smooth: true,
            data: this.theClass.times.map(v => v.leave)
          }
        ]
      };
    },
    pieOptions: function() {
      return {
        title: {
          text:
            this.theClass.course_name +
            "(" +
            this.theClass.course_time.join("|") +
            ")", //课程名称
          subtext: "课堂考勤数据平均值", //课程时间
          x: 'center'
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["正常", "迟到", "旷课", "请假"]
        },
        series: [
          {
            name: "平均每堂课",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: this.theClass.normalRatio, name: "正常" },
              { value: this.theClass.lateRatio, name: "迟到" },
              { value: this.theClass.truantlRatio, name: "旷课" },
              { value: this.theClass.leavelRatio, name: "请假" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    }
  },

  mounted() {}
};
</script>

<style stope>
.echat-attend {
  width: 100%;
  margin-bottom: 10px;
}
.echart {
  display: inline-block;
  box-sizing: border-box;
  width: max-content;
  background-color: #fff;
}

.left {
  margin-right: 10px;
}
/* .left {
  float: left;
}
.right {
  float: right;
} */
</style>
