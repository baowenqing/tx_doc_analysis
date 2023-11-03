<template>
  <div>
    <el-row :gutter="20" justify="center" align="middle">

      <el-input v-model="content" placeholder="复制腾讯文档的任务内容"
                :rows="2"
                type="textarea"
                style="width: 300px"></el-input>
      <el-button type="primary" style="margin-left: 4px;" @click="handleText">加载</el-button>


      <el-upload v-model:file-list="fileList"
                 :multiple="false" auto-upload
                 style="margin: 20px"
                 :before-upload="beforeUpload">

        <el-button type="primary" style="margin-top: 10px;">选择excel</el-button>


      </el-upload>

      <el-select v-model="curUser" placeholder="选择负责人" @change="handleChangeUser">
        <el-option v-for="item in userList" :key="item" :label="item" :value="item"/>
      </el-select>


    </el-row>
    <el-row justify="center">

      <el-calendar v-model="value" style="width: 80%">


        <template #date-cell="{ data }">

          <div style="width: 100%;height: 100%" justify="start" align="top">

            <el-row justify="space-between" style="width: 100%">
              <span>  {{ data.day.split('-').slice(1).join('-') }}</span>

              <span>{{
                  $_.isEmpty(curUserExcelData) ? "" : findItemByCurUserExcelData(data) ? '✔️' : ''
                }}</span>
            </el-row>

            <div>
              <el-text line-clamp="1" :key="index" v-for="(item,index)  in  findItemTaskByCurUserExcelData(data) ">
                <el-tooltip :content="item" placement="right-start">
                  <span>  {{ (index + 1) + ".  " + item }}</span>
                </el-tooltip>
              </el-text>
            </div>


          </div>
        </template>
      </el-calendar>

    </el-row>
    <el-row justify="center">


      <AboutView/>

    </el-row>
  </div>


</template>


<script setup>
import {onMounted, ref, toRaw} from 'vue'
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import ww from 'chinese-workday'
import AboutView from "@/views/AboutView.vue";


const value = ref(new Date())
const fileList = ref([])
const content = ref("")
const curUserExcelData = ref([])
const curUser = ref("")
const userList = ref([])
const curTotalExcelData = ref([])

let findItemByCurUserExcelData = (data) => {
  return curUserExcelData.value.find(item => item.startDate === data.day)
}


let findItemTaskByCurUserExcelData = (data) => {
  let list = curUserExcelData.value.filter(item => item.startDate === data.day)

  if (_.isEmpty(list)) {
    return []
  }

  return list.map(item => item.task)
}

let handleChangeUser = (user) => {
  // console.log(snArr)
  //获取excel列表数据
  const excelData = []
  curTotalExcelData.value.forEach((item) => {
    let users = item['人力'].split(",");
    if (users.includes(curUser.value) && !_.isNil((item["人天"]))) {

      let day = (+item["人天"]) / users.length

      //.add(1,"day") 是因为excel解析出的时间 少了一天
      let list = handleWorkDay(dayjs(item["开始日期"]).add(1, "day").format('YYYY-MM-DD'), _.ceil(day))

      list.forEach(dayStr => {
        excelData.push({
          startDate: dayStr,
          taskDay: day,
          task: item["功能"]
        })
      })


    }
  })
  curUserExcelData.value = excelData
  console.log(excelData)
}
let beforeUpload = (uploadFile) => {
  // console.log(uploadFile)
  handleReadExcel(uploadFile)

  return false
}

//解析excel表格
let handleReadExcel = (file) => {
  const that = this
  const fileReader = new FileReader()
  fileReader.onload = (ev) => {
    try {
      const workbook = xlsx.read(ev.target.result, {
        type: 'binary',
        cellDates: true,
        raw: true
        // dateNF: "yyyy年MM月dd日"
      })
      // 取第一张表
      const wsname = workbook.SheetNames[0]
      //取表头数据
      const headerData = xlsx.utils.sheet_to_json(workbook.Sheets[wsname], {header: 1})[0]
      console.log(headerData);

      curTotalExcelData.value = xlsx.utils.sheet_to_json(workbook.Sheets[wsname])

      // console.log(toRaw(      curTotalExcelData.value));

      handleUserListByData()

    } catch (e) {
      return false
    }
  }
  fileReader.readAsBinaryString(file)
}

// 解析文档数据
let handleUserListByData = () => {

  let tempUserList = new Set()
  curTotalExcelData.value.map(item => item['人力']).forEach(item => {
    let users = item.split(",")

    users.forEach(user => {
      tempUserList.add(user)
    })
  })

  userList.value = [...tempUserList].sort()
}
let handleText = () => {
  let text = content.value
  let lines = text.split("\n")
  let tempList = []
  lines.forEach(line => {
    let dataList = line.split("\t")
    console.log(dataList);
    if (dataList.length === 5 && !_.isEmpty(dataList[0])) {
      tempList.push({
            开始日期: dayjs(dataList[0], 'YYYY年MM月D日').subtract(1).toDate(),
            结束时间: dayjs(dataList[1], 'YYYY年MM月D日').subtract(1).toDate(),
            功能: dataList[2],
            人天: +dataList[3],
            人力: dataList[4],
          }
      )
    }
  })

  //兼容excel数据
  curTotalExcelData.value = tempList
  console.log(toRaw(curTotalExcelData.value))
  handleUserListByData()

}


let handleWorkDay = (startDate, taskDay) => {
  console.log(startDate, taskDay);
  //先判断下是不是工作日
  let tempCount = 0
  let tempNum = 0
  let list = []
  while (true) {

    if (ww.isWorkday(dayjs(startDate).add(tempNum, "day").toDate())) {
      list.push(dayjs(startDate).add(tempNum, "day").format('YYYY-MM-DD'))
      tempCount++
    }
    tempNum++
    if (tempCount === taskDay) {
      break
    }
  }
  // console.log(list);
  return list

}

onMounted(() => {

})

</script>

<style>
.el-calendar-table .el-calendar-day {

  min-height: 150px;
}


</style>
