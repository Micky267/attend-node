const Mock = require('mockjs') // 获取mock对象
var Random = Mock.Random
// const Random = Mock.Random // 获取random对象，随机生成各种数据，具体请翻阅文档
const domain = 'http://mockjs.com/api' // 定义默认域名，随便写

//学生和老师——》获取某学期课程
Mock.mock(`${domain}/user/getCourseList`, 'get', {
  code: 200,
  'data|4':[{
    'sid|+1':10011,
    'yearSemester':'2016~2017 第二学期',
    'cName|+1':['c语言(周五3-5)','java（周三3-5，周四8-10）','网站设计（周三3-5，周四8-10）','计算机基础（周四8-10）'],
    'tName|+1':['温老师','陈老师','谢老师','曹老师'],
    'stuId|+1:':'162011001',
    'sName':'@CNAME',
    'className|1-8':1,
    'attendTotal|18-36':1,
    'normal': function () {
      return (this.attendTotal-this.late-this.truant-this.leaves)
    },
    'late|0-5': 1,
    'truant|0-5': 1,
    'leaves|0-5': 1,
    score: function () {
      return (100 - this.late * 1 - this.truant * 5)
    }
  }]
});

//学生和老师——》获取课程考勤详情
Mock.mock(`${domain}/user/getCourseDetail`, 'get', {
  code: 200,
  'data|8':[{
    'sid|+1':1,
    'number|+1':1,
    date:'@Date',
    'status|1':['正常','请假','旷课','迟到'],
  }]
});

//管理员和老师查看学生信息
Mock.mock(`${domain}/user/getStudent`, 'get', {
  code: 200,
  'data|1':[{
    'stuId|+1':162011001,
    'sName':'@CNAME',
    'sex':['男','女'],
    'phone|1':[15107659897,1534849816],
    'grade|1':[206,2017,2018,2019],
    'faculty|1':['电气学院'],
    'majoy|1':['计算机','通信','电气','电子'],
    'className|1-8':1,
  }]
});

//老师获取要考勤的学生数据
Mock.mock(`${domain}/teacher/getAttendStu`, 'get', {
  code: 200,
  'data|16':{
    sid:200101,
    stuTotal:16,
    'yearSemester':'2016~2017 第二学期',
    'cName|+1':['c语言(周五3-5)','java（周三3-5，周四8-10）','网站设计（周三3-5，周四8-10）','计算机基础（周四8-10）'],
    'tName|+1':['温老师','陈老师','谢老师','曹老师'],
    'stuList|16':[{
    'sid|+1':200101001,
    'number|+1':1,
    'stuId|+1':162011001,
    'sName':'@CNAME',
    'sex|1':['男','女'],
    'className|+1':['16计算机7班','16计算机8班','16计算机1班','16计算机6班'],
  }]}
});

//管理员获取所有课程
Mock.mock(`${domain}/admin/getAllCoures`, 'get', {
  code: 200,
  'data|1-10':[{
    'sid|+1':10011,
    'yearSemester':'2016~2017 第二学期',
    'majoy|1':['计算机','通信','电气','电子'],
    'cNameTime|+1':['c语言(周五3-5)','java（周三3-5，周四8-10）','网站设计（周三3-5，周四8-10）','计算机基础（周四8-10）'],
    'tName|+1':'@CNAME',
    'attendTotal|18-36':1,
    'stuTotal|50-100':1,
    'lateAVG|0-5': 1,
    'truantAVG|0-5': 1,
    'leavesAVG|0-5': 1,
  }]
});

//管理员查看老师信息
Mock.mock(`${domain}/admin/getTeacher`, 'get', {
  code: 200,
  'data|1':[{
    'tId|+1':1001,
    'sName':'@CNAME',
    'sex':['男','女'],
    'phone|1':[15107659897,1534849816],
    'faculty|1':['电气学院'],
  }]
});


//————————————————
/**
 * 导进去数据库的数据
 * 
 */

 //行政班表
Mock.mock(`${domain}/database/adminClass`, 'get', {
  code: 200,
  'data|50':[{
    'sid|+1':162011,
    'className|+1':[1,2,3,4,5,6,7,8],
    'grade|2016-2020':1,
    'faculty|+1':['电气学院','会计学院','商学院','文传系','医学院','音乐学院','国际学院'],
    'major|+1':['计算机科学与技术','会计','工商管理','网络与多媒体','护理','音乐','德语',]
  }]
});

 //学生表
 Mock.mock(`${domain}/database/student`, 'get', {
  code: 200,
  'data|750':[{
    'sid|+1':162011001,
    'name':'@CNAME',
    'sex|1':['男','女'],
    'acId|162011-162060':1,
    'phone|+1':15107680001,
    'password':123
  }]
});


 //教师表
 Mock.mock(`${domain}/database/teacher`, 'get', {
  code: 200,
  'data|10':[{
    'sid|+1':1001,
    'name':'@CNAME',
    'sex|1':['男','女'],
    'phone|+1':18108712000,
    'password':123
  }]
});

 //教学班表
 Mock.mock(`${domain}/database/teacherClass`, 'get', {
  code: 200,
  'data|5':[{
    'sid|+1':200111,
    'cId|2001-2013':1,
    'time|1':['周一3-5','周二3-5,周三2-3','周四9-11,周五1-3','周二9-11','周三9-11'],
    'tId|+1':1001,
    'classroom|1':['2-202','2-201','2-203','2-204','2-301','3-201','3-202','4-201'],
    'stuTotal':75,
    'attendTotal':0,
    'lateScore':1,
    'truantScore':5,
  }]
});

 //教学班学生表
 Mock.mock(`${domain}/database/teacherClassStudent`, 'get', {
  code: 200,
  'data|75':[{
    'sid|+1':2001012001,
    'tcId':200115,
    'stuId|+1':162011301,
    'truant':0,
    'leaves':0,
    'late':0,
  }]
});

 //考勤表
 Mock.mock(`${domain}/database/teacherClassStudent`, 'get', {
  code: 200,
  'data|950':[{
    'i|+1':1,
    'sid':function(){
      return new Date().getTime()+(this.i+'')
    },
    'tcsId|+1':200101001,
    'date':'2017-04-29',
    'status|1':[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,3,4],
  }]
});

//————————————————————————————————————————————————————————
// 随机生成文章数据
// 定义请求链接，类型，还有返回数据
// 获取每个课程每个学生的具体情况
Mock.mock(`${domain}/courseStuDatas`, 'post', {
  code: 200,
  'course|0-2': [{
    'c_id|+1': 2001,
    'c_name|+1': ["java", "c语言", "网站设计"],
    'times|1-2': [
      {
        'time|+1': ["周一 3-5", "周二 4-5", "周三 7-8", "周四 12-15", "周一 9-11"],
        'students|50-100': [
          {
            's_id|+1': 162011001,
            's_name': '@cname',
            'normal|1-18': 1,
            'late|0-5': 1,
            'truant|0-5': 1,
            'leaves|0-5': 1,
            score: function () {
              return (100 - this.late * 2 - this.truant * 5)
            }
          }]
      }]
  }]
});


// 获取上课考勤总体情况，做图表用的
// 一个老师两门课，每门课有1-2个班，每门课每周可能1-2堂
//classes 老师可能会带几个班级
//每个班级都有id
Mock.mock(`${domain}/courseTotal/1.json`, 'get', {
  totalPages: 3,//总共分成3个请求
  code: 200,
  'classes|0-2': [
    // {  //顺序抽取哪堂课
    //   'class_id|+1': 20160101, //具体班级的id
    //   'course_name': 'java',
    //   'course_time|+1': [['周二8-10', '周四8-10'], ['周一 8-10', '周三 8-10 ']],
    //   'times|32-36': [  //该门课对应的周数，显示每一周的详细情况
    //     {
    //       'actualNum': -1,
    //       'late|0-5': 1,
    //       'truant|0-5': 1,
    //       'leaves|0-5': 1,
    //     }
    //   ],
    //   'total|50-100': 1  //该门课总上课人数
    // },
    {
      'class_id|+1': 20160201, //具体班级的id
      'course_name': 'c语言',
      'course_time|+1': [['周二8-10'], ['周一 8-10']],
      'normalRatio': 90,
      'lateRatio': 6,
      'truantlRatio': 2,
      'leaveslRatio': 2,
      'times|16-18': [  //该门课对应的周数，显示每一周的详细情况
        {
          'actualNum': -1,
          'late|0-5': 1,
          'truant|0-5': 1,
          'leaves|0-5': 1,
        }
      ],
      'total|80-110': 1  //该门课总上课人数
    }
  ],
});

Mock.mock(`${domain}/courseTotal/2.json`, 'get', {
  totalPages: 3,//总共分成3个请求
  code: 200,
  'classes|2': [
    {  //顺序抽取哪堂课
      'class_id|+1': 20160101, //具体班级的id
      'course_name': 'java',
      'course_time|+1': [['周二8-10', '周四8-10'], ['周一 8-10', '周三 8-10 ']],
      'normalRatio': 89,
      'lateRatio': 7,
      'truantlRatio': 2,
      'leaveslRatio': 2,
      'times|32-36': [  //该门课对应的周数，显示每一周的详细情况
        {
          'actualNum': -1,
          'late|0-5': 1,
          'truant|0-5': 1,
          'leaves|0-5': 1,
        }
      ],
      'total|50-100': 1  //该门课总上课人数
    },
    {
      'class_id|+1': 20160201, //具体班级的id
      'course_name': 'c语言',
      'course_time|+1': [['周二8-10'], ['周一 8-10']],
      'normalRatio': 95,
      'lateRatio': 3,
      'truantlRatio': 2,
      'leaveslRatio': 0,
      'times|16-18': [  //该门课对应的周数，显示每一周的详细情况
        {
          'actualNum': -1,
          'late|0-5': 1,
          'truant|0-5': 1,
          'leaves|0-5': 1,
        }
      ],
      'total|80-110': 1  //该门课总上课人数
    }
  ],
});

Mock.mock(`${domain}/courseTotal/3.json`, 'get', {
  totalPages: 3, //总共分成3个请求
  code: 200,
  'classes|2': [
    {  //顺序抽取哪堂课
      'class_id|+1': 20160101, //具体班级的id
      'course_name': 'java',
      'course_time|+1': [['周二8-10', '周四8-10'], ['周一 8-10', '周三 8-10 ']],
      'normalRatio': 89,
      'lateRatio': 7,
      'truantlRatio': 2,
      'leaveslRatio': 2,
      'times|32-36': [  //该门课对应的周数，显示每一周的详细情况
        {
          'actualNum': -1,
          'late|0-5': 1,
          'truant|0-5': 1,
          'leaves|0-5': 1,
        }
      ],
      'total|50-100': 1  //该门课总上课人数
    },
    {
      'class_id|+1': 20160201, //具体班级的id
      'course_name': 'c语言',
      'course_time|+1': [['周二8-10'], ['周一 8-10']],
      'normalRatio': 70,
      'lateRatio': 15,
      'truantlRatio': 5,
      'leaveslRatio': 5,
      'times|16-18': [  //该门课对应的周数，显示每一周的详细情况
        {
          'actualNum': -1,
          'late|0-5': 1,
          'truant|0-5': 1,
          'leaves|0-5': 1,
        }
      ],
      'total|80-110': 1  //该门课总上课人数
    }
  ],
});


