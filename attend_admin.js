var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '123456', 
    database: 'attendance'
});
app.use(bodyParser.urlencoded({extend:false})); //post 获取主体内容
app.use(bodyParser.json());

/**
 * 系统功能接口
 * 
 */

/**
 * 所有人
 */

//修改密码
app.post("/user/updatePW",(req,res)=>{
    console.log('修改密码接收到的参数',req.body)
    let userId = req.body.sid,
        pw = req.body.pw,
        role = req.body.role,
        sql = ''
        switch(role){
            case 1:
                sql = `UPDATE student SET  password = '${pw}' where sid = '${userId}'`
                break;
            case 2:
                sql = `UPDATE teacher SET  password = '${pw}' where sid = '${userId}'`
                break;
            case 3:
                sql = `UPDATE admin SET  password = '${pw}' where sid = '${userId}'`
            default:
                return
        }
        connection.query(sql,(error,data)=>{
            if(error){
                var result = {
                   "status": "500",
                   "message": error,
                }
                return res.json(result)
            }
            else{
               var result = {
                   "status": "200",
                   "message": "success",
                   data
                }
                return res.json(result)
            }
        })


})

//登录
app.get("/user/login",(req,res)=>{
    console.log('登录接收到的参数',req.query)
    let userId = req.query.sid,
        pw = req.query.pw,
        role = req.query.role,
        sql = ''
        switch(role){
            case '1':
                sql = `select * from student where sid = '${userId}' and password ='${pw}'`
                break;
            case '2':
                sql = `select * from teacher where sid = '${userId}' and password ='${pw}'`
                break;
            case '3':
                sql = `select * from admin where sid = '${userId}' and password ='${pw}'`
                break;
                default:
                sql = ''
        }
        console.log('登录时的sql',sql)
        connection.query(sql,(error,data)=>{
            if(error){
                var result = {
                   "status": "500",
                   "message": error,
                }
                return res.json(result)
            }
            else{
                if(data.length>0){
                    var result = {
                        "status": "200",
                        "message": "success",
                        data
                     }
                }
                else{
                    var result = {
                        "status": "200",
                        "message": "fail",
                        data
                     }
                }

                return res.json(result)
            }
        })


})

 /**
  * 学生和老师
  */

 //获取所有课程学生考勤情况
 app.get("/user/getCourseList",(req,res)=>{
     console.log('获取所有课程学生考勤情况接收到的参数a',req.query)
    let queryObj = req.query ,
        condition = '',
        limitStart = (queryObj.page - 1)*queryObj.size,
        limitSize = queryObj.size

    //将参数格式改成请求数据库字段格式
    if(Object.keys(queryObj).length!=0){
        for (let key in queryObj){
            if(queryObj[key].toString().trim().length != 0){
              let attr = ''
              switch(key){
                case 'page':
                    continue;  
                case 'size':
                    continue;  
                case 'stuId':
                  attr = 'student.sid'
                  break;
                case 'tId':
                  attr = 'teacher.sid'
                  break;
                case 'tcId':
                  attr=`teach_class.sid` 
                  break;
                default :
                  attr = key
              }
              condition += `AND ${attr} = '${queryObj[key]}' `
            }
          }
          console.log('要添加的语句',condition)
     }

    let  totalSql = `SELECT count(*) AS total FROM teacher,admin_class,student,teach_class_student,course,teach_class
    WHERE admin_class.sid = student.ac_id AND
    student.sid = teach_class_student.stu_id AND
    teach_class.sid = teach_class_student.tc_id AND
    course.sid = teach_class.c_id AND
    teacher.sid = teach_class.t_id ${condition};`


     connection.query(totalSql,(error,totaoData)=>{
        if(error){
            console.log('查询总数量出错！',error)
        }
        else{
            console.log('查询总数量成功！',totaoData)
                 
            if(queryObj.page >totaoData / queryObj.size)
            {
                limitSize = -1
            }

            let  sSql = `SELECT (@i:=@i+1) AS number, teach_class_student.sid AS sid,CONCAT(CAST(admin_class.grade AS CHAR),CAST(admin_class.majoy AS CHAR),CAST(admin_class.class_name AS CHAR),'班')  AS className,
            student.sid AS stuId,student.name AS sName,
            teacher.name AS tName,
            course.name AS cName, CONCAT(CAST(year AS CHAR),'第',CAST(semester AS CHAR),'学期') AS yearSemester,
            teach_class.attend_total AS attendTotal, teach_class_student.truants AS truants,teach_class_student.leaves AS leaves,teach_class_student.lates AS lates,(teach_class.attend_total-truants-leaves-lates) AS normals
            FROM teacher,admin_class,student,teach_class_student,course,teach_class,(select @i:=0) as it 
            WHERE admin_class.sid = student.ac_id AND
            student.sid = teach_class_student.stu_id AND
            teach_class.sid = teach_class_student.tc_id AND
            course.sid = teach_class.c_id AND
            teacher.sid = teach_class.t_id ${condition} limit ${limitStart},${limitSize};`
            
            
            connection.query(sSql,(error,data)=>{
                if(error){
                    var result = {
                       "status": "500",
                       "message": error,
                    }
                    return res.json(result)
                }
                else{
                   var result = {
                       "status": "200",
                       "message": "success",
                       "total":totaoData[0].total,
                       data
                    }
                    return res.json(result)
                }
            })
        }
     })
 })


 //获取指定学生某堂课考勤详情
 app.get("/user/getCourseDetail",(req,res)=>{
    console.log('接收到的参数',req.query.sid)
     let sid = req.query.sid 
    let sql = `select sid, (@i:=@i+1) AS number, tcs_id AS tcsId,CAST(date AS CHAR) AS date,status from attendance,(select @i:=0) as it where tcs_id = ${sid};`
    connection.query(sql,(error,data)=>{
        if(error){
            var result = {
               "status": "500",
               "message": error,
            }
            return res.json(result)
        }
        else{
           var result = {
               "status": "200",
               "message": "success",
               data
            }
            return res.json(result)
        }
    })
})


/**
 * 老师功能
 */
//获取某学期所教课程
 app.get("/teacher/getSemesterCourses",(req,res)=>{
     console.log('请求的参数',req.query)
    let tId = req.query.tId,
        year = req.query.year,
        semester = req.query.semester
    let sql = ` select teach_class.sid AS value,CONCAT(course.name,'(',teach_class.time,')') AS label from teacher,teach_class,course where teacher.sid = teach_class.t_id and course.sid = teach_class.c_id and year='${year}' and semester = ${semester} and teacher.sid ='${tId}'`
    connection.query(sql,(error,data)=>{
        data.forEach((item,index) => { 
            item.leaf = true
        });
        if(error){
            var result = {
               "status": "500",
               "message": error,
            }
            return res.json(result)
        }
        else{
           var result = {
               "status": "200",
               "message": "success",
               data
            }
            return res.json(result)
        }
    })
})

//获取要考勤的学生信息
app.get("/teacher/getAttendStu",(req,res)=>{
    console.log('接收到的参数',req.query)
   let  tcId = req.query.tcId 
   let  totalSql =  `SELECT count(*) AS total
   FROM teacher,admin_class,student,teach_class_student,course,teach_class,(select @i:=0) as it
   WHERE admin_class.sid = student.ac_id AND
   student.sid = teach_class_student.stu_id AND
   teach_class.sid = teach_class_student.tc_id AND
   course.sid = teach_class.c_id AND
   teacher.sid = teach_class.t_id AND teach_class.sid = ${tcId};`


    connection.query(totalSql,(error,totaoData)=>{
       if(error){
           console.log('查询总数量出错！',error)
       }
       else{
           console.log('查询总数量成功！',totaoData)

           let  sSql = `SELECT (@i:=@i+1) AS number,teach_class_student.sid AS sid,CONCAT(CAST(admin_class.grade AS CHAR),CAST(admin_class.majoy AS CHAR),CAST(admin_class.class_name AS CHAR),'班')  AS className,
           student.sid AS stuId,student.name AS sName,student.sex AS sex,
           teacher.name AS tName,
           course.name AS cName, CONCAT(CAST(year AS CHAR),'第',CAST(semester AS CHAR),'学期') AS yearSemester
           FROM teacher,admin_class,student,teach_class_student,course,teach_class,(select @i:=0) as it
           WHERE admin_class.sid = student.ac_id AND
           student.sid = teach_class_student.stu_id AND
           teach_class.sid = teach_class_student.tc_id AND
           course.sid = teach_class.c_id AND
           teacher.sid = teach_class.t_id AND teach_class.sid = ${tcId};`
           
           connection.query(sSql,(error,data)=>{
               if(error){
                   var result = {
                      "status": "500",
                      "message": error,
                   }
                   return res.json(result)
               }
               else{
                  var result = {
                      "status": "200",
                      "message": "success",
                      "total":totaoData[0].total,
                      data
                   }
                   return res.json(result)
               }
           })
       }
    })
})

//判断是否已经考勤过
app.get("/teacher/ifAttended",(req,res)=>{
    let tcId = req.query.tcId
        date = req.query.date
        sql = `select teach_class_student.sid from attendance,teach_class,teach_class_student where attendance.tcs_id = teach_class_student.sid and teach_class.sid = teach_class_student.tc_id and attendance.date = '${date}' and teach_class.sid = '${tcId}'`
        connection.query(sql,(error,data)=>{
            if(error){
                var result = {
                   "status": "500",
                   "message": error,
                }
                return res.json(result)
            }
            else{
               var result = {
                   "status": "200",
                   "message": "success",
                   data
                }
                return res.json(result)
            }
        })
})


//添加考勤数据
app.post("/teacher/addAttendance",(req,res)=>{
    const dataList = req.body.jsonData
    const insertSql = 'INSERT INTO attendance(sid,tcs_id,date,status) values(?,?,?,?)'
    let updateStatusSql = ''
    let updateTimesSql = ''
    let statusName = ''
    let sid = ''
    updateTimesSql = `UPDATE teach_class SET attend_total=attend_total+1  WHERE teach_class.sid = ${dataList[0].tcId}`
    connection.query(updateTimesSql,(error, data) => {
            if (error) {
                console.log('增加考勤次数失败！',error)

            } else {
                console.log('增加考勤次数成功了！',data)
            }
    });

    for(let i = 0; i < dataList.length; i++){
        sid = new Date().getTime()+(i+'')
       let insertparams =  [sid, dataList[i].tcsId,dataList[i].date,dataList[i].status];

        //获取状态，教学班学生信息对应项增加1
        connection.query(insertSql, insertparams, (error, data) => {
               if (error) {
                   console.log('添加学生信息失败了')
                   var result = {
                       "status": "500",
                       "message": error,
                   }
                   return res.jsonp(result);
   
               } else {
                   switch(dataList[i].status){
                       case '2':
                           statusName = 'lates'   
                           break
                       case '3':
                           statusName = 'truants'   
                           break
                       case '4':
                           statusName = 'leaves'
                           break
                       default:
                           statusName = 'normals'   
                           break;     
                   }
                   if(statusName=='lates'||statusName=='truants'||statusName=='leaves'){
                       updateStatusSql = `UPDATE teach_class_student SET ${statusName}=${statusName}+1  WHERE teach_class_student.sid = ${dataList[i].tcsId}`
                       connection.query(updateStatusSql,(error, data) => {
                           if(i == dataList.length-1){
                               if (error) {
                                   console.log('增加状态失败了！')
                                   var result = {
                                    "status": "500",
                                    "message": error,
                                }
                                return res.jsonp(result);
                               } else {
                                console.log('增加状态成功了！')
                                var result = {
                                    "status": "200",
                                    "message": "success",
                                    data: data
                                }
                                return res.jsonp(result);
                               }
                            }
                       });
                    }
                    else{
                        if(i == dataList.length-1){
                            if (error) {
                                console.log('增加正常状态失败了！')
                                var result = {
                                 "status": "500",
                                 "message": error,
                             }
                             return res.jsonp(result);
                            } else {
                             console.log('增加正常状态成功了！')
                             var result = {
                                 "status": "200",
                                 "message": "success",
                             }
                             return res.jsonp(result);
                            }
                         }
                    }
               }
       });
       }

})

//修改学生考勤状态
app.post("/teacher/updateStu",(req,res)=>{
    //1、修改状态
    console.log('修改状态接收到的参数',req.body.reqCurStatus)
    let attendId  = req.body.reqCurStatus.attendId
        tcsId = req.body.reqCurStatus.tcsId
        oldStatus = req.body.reqCurStatus.oldStatus
        oldStatusName = ''
        newStatus = req.body.reqCurStatus.newStatus
        newStatusName = ''
        switch(oldStatus){
            case 2:
                oldStatusName = 'lates'
                break
            case 3:
                oldStatusName = 'truants'
                break
            case 4:
                oldStatusName = 'leaves'
                break
            default:
                oldStatusName = 'normals'
                break
        }
        switch(newStatus){
            case 2:
                newStatusName = 'lates'
                break
            case 3:
                newStatusName = 'truants'
                break
            case 4:
                newStatusName = 'leaves'
                break
            default:
                newStatusName = 'normals'
                break
        }
        updateStatusSql = `UPDATE attendance SET status = ${newStatus} where sid = '${attendId}'`
        if(oldStatus == 1&& newStatus != 1){
            updateTimesSql = `UPDATE teach_class_student SET ${newStatusName} =  ${newStatusName}+1 where sid = ${tcsId}` 
        }
        else if(oldStatus!=1&&newStatus==1){
            updateTimesSql = `UPDATE teach_class_student SET ${oldStatusName} =  ${oldStatusName}-1 where sid = ${tcsId}` 
        }
        else if(oldStatus==1&&newStatus==1){
            updateTimesSql = `` 
        }
        else{
            updateTimesSql = `UPDATE teach_class_student SET ${oldStatusName} =  ${oldStatusName}-1,${newStatusName} =  ${newStatusName}+1 where sid = ${tcsId}` 
        }
        console.log('updateTimesSql',updateTimesSql)
        connection.query(updateStatusSql,(error,data)=>{
            if(error){
                console.log('更改状态失败！')
            }
            else{
                console.log('更改状态成功！')
                if(updateTimesSql != ''){

                    connection.query(updateTimesSql,(error,data)=>{
                        if(error){
                            var result = {
                               "status": "500",
                               "message": error,
                            }
                            return res.json(result)
                        }
                        else{
                           var result = {
                               "status": "200",
                               "message": "success",
                               data
                            }
                            return res.json(result)
                        }
                    })
                }
                else{
                    var result = {
                        "status": "200",
                        "message": "success",
                        data
                     }
                     return res.json(result)
                }
            }
        })


    //2、在teach_class_student 修改原来状态和现在状态的次数

})

/**
 * 管理员功能
 * 
 */

 //请求课程列表
 app.get("/admin/getAllCoures",(req,res)=>{
     console.log('管理员拿到的请求参数')
     let queryObj = req.query,
         condition = '',
         ratesql = '',
         resData = []
            //将参数格式改成请求数据库字段格式
    if(Object.keys(queryObj).length!=0){
        for (let key in queryObj){
            if(queryObj[key].toString().trim().length != 0){
              let attr = ''
              switch(key){
                case 'page':
                    continue;  
                case 'size':
                    continue;  
                case 'cName':
                  attr = 'course.name'
                  condition += `AND ${attr} like '%${queryObj[key]}%' `
                  continue;
                case 'tName':
                  attr = 'teacher.name'
                  condition += `AND ${attr} like '%${queryObj[key]}%' `
                  continue;
                case 'grade':
                  attr=`course.grade` 
                  break;
                default :
                  attr = key
              }
              condition += `AND ${attr} = '${queryObj[key]}' `
            }
          }
          console.log('要添加的语句',condition)
     }

     let  getCidSql = `select teacher.name,teach_class.sid,course.name,course.year,course.semester,course.grade 
                        from teach_class,teacher,course
                        where teacher.sid = teach_class.t_id and course.sid = teach_class.c_id ${condition};`
    connection.query(getCidSql,(error,data)=>{
        if(error){
            console.log('mei进来了')
            
            var result = {
                "status": "500",
                "message": error,
            }
            return res.json(result)
        }
        else{
            console.log('进来了',data)
            if(data.length!=0){
                for(let i = 0;i < data.length; i++){
                    ratesql = `SELECT 
                    teacher.name AS tName,
                    CONCAT(course.name,'(',teach_class.time,')') AS cName, CONCAT(CAST(year AS CHAR),'第',CAST(semester AS CHAR),'学期') AS yearSemester,course.grade AS cGrade,
                    teach_class.attend_total AS attendTotal,
                    teach_class.stu_total AS stuTotal,SUM(leaves)/(teach_class.attend_total*stu_total)  AS leaveRate, SUM(truants)/(teach_class.attend_total*stu_total)  AS truantRate, SUM(lates)/(teach_class.attend_total*stu_total)  AS lateRate, SUM((teach_class.attend_total-truants-leaves-lates))/(teach_class.attend_total*stu_total) AS normalRate
                    FROM teacher,teach_class_student,course,teach_class,(select @i:=0) as it 
                    WHERE
                    teach_class.sid = teach_class_student.tc_id AND
                    course.sid = teach_class.c_id AND
                    teacher.sid = teach_class.t_id AND
                    teach_class.sid = '${data[i].sid}';`
                    console.log('拿到比率的sql语句',ratesql)
                    connection.query(ratesql,(error,data2)=>{
                        if(error){
                            var result = {
                               "status": "500",
                               "message": error,
                            }
                            return res.json(result)
                        }
                        else{
                            resData.push(data2[0])
                            if(i == data.length-1){
                                console.log('最后了')
                                var result = {
                                    "status": "200",
                                    "message": "success",
                                    data:resData
                                 }
                                 return res.json(result)
                            }
                        }
                    })
                    
                }
            }

            else{
                var result = {
                    "status": "200",
                    "message": "success",
                    data:[]
                 }
                 return res.json(result)
            }
          


            // var result = {
            //     "status": "200",
            //     "message": "success",
            //     data
            // }
            // return res.json(result)
        }
    })       
        

 })


 //学生信息
 app.get("/admin/getStudent",(req,res)=>{
    let sid = req.query.sid
        sql = `SELECT 
        student.sid AS sid,student.name AS sName,sex,phone,grade,faculty,majoy,admin_class.class_name AS className
        FROM student,admin_class where student.ac_id = admin_class.sid and student.sid = '${sid}'`
        connection.query(sql,(error,data)=>{
            if(error){
                var result = {
                   "status": "500",
                   "message": error,
                }
                return res.json(result)
            }
            else{
               var result = {
                   "status": "200",
                   "message": "success",
                   data
                }
                return res.json(result)
            }
        })
})

//老师信息
app.get("/admin/getTeacher",(req,res)=>{
    console.log('传过来的参数：',req.query)
    let sid = req.query.sid
        sql = `SELECT sid,name AS sName,sex,phone FROM teacher where sid = '${sid}'`
        console.log('获取老师信息的sql',sql)
        connection.query(sql,(error,data)=>{
            if(error){
                var result = {
                   "status": "500",
                   "message": error,
                }
                return res.json(result)
            }
            else{
               var result = {
                   "status": "200",
                   "message": "success",
                   data
                }
                return res.json(result)
            }
        })
})

/**
 * 数据库添加随机数据接口
 * 
 */

 //添加考勤数据
 app.post("/addAttendance",(req,res)=>{
     const dataList = req.body.jsonData
     console.log('请求的考勤数据参数：',dataList)
     const insertSql = 'INSERT INTO attendance(sid,tcs_id,date,status) values(?,?,?,?)'
     let updateStatusSql = ''
     let updateTimesSql = ''
     let statusName = ''
     let sid = ''
     for(let i = 0; i < dataList.length; i++){
         sid = new Date().getTime()+(i+'')
        let insertparams =  [sid, dataList[i].tcsId,dataList[i].date,dataList[i].status];
         //获取状态，教学班学生信息对应项增加1
         connection.query(insertSql, insertparams, (error, data) => {
            // if(i == dataList.length-1){
                if (error) {
                    var result = {
                        "status": "500",
                        "message": error,
                    }
                    return res.jsonp(result);
    
                } else {
                    switch(dataList[i].status){
                        case 2:
                            statusName = 'lates'   
                            break
                        case 3:
                            statusName = 'truants'   
                            break
                        case 4:
                            statusName = 'leaves'
                            break
                        default:
                            statusName = 'error'   
                            break;     
                    }

                    if(statusName=='lates'||statusName=='truants'||statusName=='leaves'){
                        updateStatusSql = `UPDATE teach_class_student SET ${statusName}=${statusName}+1  WHERE teach_class_student.sid = ${dataList[i].tcsId}`
                        connection.query(updateStatusSql,(error, data) => {
                            if(i == dataList.length-1){
                                if (error) {
                                    console.log('增加失败了！')
                                } else {
                                    console.log('增加成功了！')
                                    updateTimesSql = `UPDATE teach_class SET attend_total=attend_total+1  WHERE teach_class.sid = ${dataList[i].tcId}`
                                    connection.query(updateTimesSql,(error, data) => {
                                        if(i == dataList.length-1){
                                            if (error) {
                                                console.log('增加考勤次数失败！',error)
                                                var result = {
                                                    "status": "500",
                                                    "message": error,
                                                }
                                                return res.jsonp(result);
                                            } else {
                                                console.log('增加考勤次数成功了！')
                                                var result = {
                                                    "status": "200",
                                                    "message": "success",
                                                    data: data
                                                }
                                                return res.jsonp(result);
                                            }
                                         }
                                    });

                                }
                             }
                        });
                     }
                }
            //  }
        });
        }

 })

//添加班级数据
app.post("/addAdminClass", (req, res) => {
  const dataList =req.body.jsonData
  const sql = 'insert into admin_class(sid,class_name,grade,faculty,majoy) values(?,?,?,?,?);';
  for(let i = 0;i < dataList.length;i++){
      var params =  [dataList[i].sid, dataList[i].className,dataList[i].grade,dataList[i].faculty,dataList[i].major];
      connection.query(sql, params, (error, data) => {
         if(i == dataList.length-1){
            if (error) {
                var result = {
                    "status": "500",
                    "message": error,
                }
                return res.jsonp(result);

            } else {
                var result = {
                    "status": "200",
                    "message": "success",
                    data: data
                }
                return res.jsonp(result);
            }
         }

    });
  }
})


app.listen(7878)
console.log("启动了7878端口")