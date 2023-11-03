<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-row>

      <el-text>{{ `useClipboard：` + text + "---" + useClipboardModelValue }}</el-text>

      <el-input v-model="useClipboardModelValue" placeholder="输入需要复制的值" style="width:65%"></el-input>
      <el-button @click="copy(useClipboardModelValue)">点击复制</el-button>

    </el-row>


    <el-row>
      <el-text>{{ `useInterval：` + useIntervalValue }}</el-text>
    </el-row>

    <el-row  >
      <el-text>{{ `useStorage：` + JSON.stringify(useStorageValue) }}</el-text>
    </el-row>

    <el-row  >
      <el-text>{{ `useTimeout：` +timeoutRef}}</el-text>
    </el-row>

    <div class="box box1" ref="box1Ref">
      <p>width: {{ width }}</p>
      <p>height: {{ height }}</p>
      <p>x: {{ x }}</p>
      <p>y: {{ y }}</p>
    </div>

    <div class="box box2" ref="box2Ref">
      <p>width: {{ width2 }}</p>
      <p>height: {{ height2 }}</p>
      <p>x: {{ x2 }}</p>
      <p>y: {{ y2 }}</p>
    </div>



  </div>
</template>
<script setup>
import {toReactive, useClipboard, useInterval, useStorage, useTimeout} from "@vueuse/core";
import {reactive, ref} from "vue";

let useClipboardModelValue = ref("")
const {text, copy} = useClipboard();


let useIntervalValue = ref(0)
const counter = useInterval(1000, {
  callback: () => {
    useIntervalValue.value += 2
    useStorageValue.hello = "hi"+    useIntervalValue.value
  }
})


let useStorageValue = toReactive(useStorage('my-store', {hello: 'hi', greeting: 'Hello'}))


let timeoutRef=useTimeout(2000,{
  callback:()=>{
    console.log("执行1s后的延迟了")
  }
})

const box1Ref = ref(null)
const box2Ref = ref(null)

import { useElementRect } from '../util/useElementRect'
const { width, height, x, y } = useElementRect(box1Ref)
const { width: width2, height:height2, x:x2, y:y2 } = useElementRect(box2Ref)

</script>


<style>
@media (min-width: 1024px) {
  .box {
    background: #040D19;
    border-radius: 12px;
    color: #fff;
    text-align: center;
    margin: 20px;
    padding-top: 20px;
  }
  .box1 {
    width: 200px;
    aspect-ratio: 1 / 1;
  }
  .box2 {
    width: 260px;
    aspect-ratio: 1 / 1;
  }
  .about {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
