<!-- 天气、时间以及下拉选择 -->
<template>
  <div class="nav-right">
    <!--  天气  -->
    <div class="weather-info">
      <el-icon :size="18">
        <Sunny/>
      </el-icon>
      <div style="margin-left: 4px;">
        广州｜晴 23℃
      </div>
    </div>
    <!--  当前系统时间  -->
    <div class="system-date">
      <div class="system-time">
        {{ systemDate.systemTime }}
      </div>
      <div class="system-week">
        {{ systemDate.systemDay }} {{ systemDate.systemWeek }}
      </div>
    </div>
    <!--  信息icon  -->
    <div class="message-icon">
      <el-badge :value="messageCount" :hidden="!messageCount" class="item">
        <img :src="messageIcon" alt="">
      </el-badge>
    </div>
    <!--  用户操作下拉  -->
    <div class="right-menu">
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <div class="avatar-box">
            <img :src="avatar" class="user-avatar" alt=""/>
          </div>
          <div class="user-name">{{ userName }}</div>
          <el-icon :size="10" color="#fff">
            <ArrowDownBold/>
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="handleLogout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {useUserStore} from "@/store/user.js";
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import avatarImg from '@/assets/images/avatar@2x.png'
import messageIcon from '@/assets/images/messageIcon@2x.png'
import {ArrowDownBold, Sunny} from '@element-plus/icons-vue'
import dayjs from "dayjs";
import axios from "axios";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
// 用户头像
const avatar = ref(userStore.getUserAvatar || avatarImg)
// 用户昵称
const userName = ref(userStore.getUserName || '管理员')
// 定时器timer
let timer = null
const systemDate = reactive({
  systemDay: dayjs().format("YYYY-MM-DD"),
  systemTime: dayjs().format("HH:mm:ss"),
  systemWeek: ''
})
// 角标提示数量
const messageCount = ref(0)
onMounted(() => {
  getSystemTime()
  timer = setInterval(() => {
    systemDate.systemTime = dayjs().format("HH:mm:ss")
  }, 1000)
})
// 页面卸载删除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// 退出登录
function handleLogout() {
  userStore.logout().then(() => {
    router.push(`/login?redirect=${route.fullPath}`)
  })
}

// 系统时间
function getSystemTime() {
  const weekList = ['日', '一', '二', '三', '四', '五', '六'];
  systemDate.systemWeek = '星期' + weekList[dayjs().day()]
}

// 获取地址以及气温
// function getWeather() {
//   axios.get("http://pv.sohu.com/cityjson?ie=utf-8")
//       .then(res => {
//         // let datas = res.data.data[0];//下标为0即表示当天天气数据
//         console.log(res.data);
//       })
//       .catch(err => {
//         console.log(err);
//       });
// }
</script>

<style scoped lang="scss">
.nav-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.right-menu {
  cursor: pointer;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  line-height: 22px;
  margin: 0 4px 0 8px;
}

.avatar-box {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;

  .user-avatar {
    width: 24px;
    height: 24px;
  }
}

.message-icon {
  margin: 0 24px;

  img {
    width: 24px;
    height: 24px;
  }
}

.weather-info {
  display: flex;
  align-items: center;
  margin-right: 24px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  line-height: 20px;
  min-width: 80px;
}

.system-date {
  text-align: center;
  min-width: 110px;

  .system-week {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    line-height: 20px;
  }

  .system-time {
    font-size: 18px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.85);
    line-height: 20px;
    letter-spacing: 2px;
  }
}
</style>
