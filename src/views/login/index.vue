<template>
  <div class="login-container">
    <div class="login-box">
      <div class="illustration-img">
        <p class="company-title">{{ defaultSettings.title }}</p>
        <img class="illustration" :src="loginData.illustrationBg" alt="">
      </div>
      <div class="form-box">
        <div>
          <h1>账号登录</h1>
          <div class="form-info">
            <el-form
                ref="loginFormRef"
                :model="loginData.loginForm"
                :rules="loginData.loginRules"
                class="login-form"
                auto-complete="on"
                label-position="left"
            >
              <el-form-item prop="phonenumber">
                <el-input
                    ref="phonenumber"
                    v-model="loginData.loginForm.phonenumber"
                    placeholder="输入用户名"
                    name="phonenumber"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                />
              </el-form-item>

              <el-form-item prop="password" style="margin-bottom: 20px">
                <el-input
                    :key="loginData.passwordType"
                    ref="password"
                    v-model="loginData.loginForm.password"
                    :type="loginData.passwordType"
                    placeholder="输入密码"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="loginData.passwordType === 'password' ? 'eye' : 'eye-open'" color="#9a9a9a"/>
                </span>
              </el-form-item>
              <!--              -->
              <div v-if="loginData.loginForm.password!==''&& loginData.loginForm.phonenumber!==''"
                   style="margin-top: 60px">
                <el-button
                    :loading="loginData.loading"
                    type="primary"
                    class="login-btn"
                    @click.native.prevent="handleLogin(loginFormRef)"
                >登 录
                </el-button>
              </div>
              <div v-else style="margin-top: 60px;opacity:0.49">
                <el-button
                    :loading="loginData.loading"
                    type="primary"
                    class="login-btn"
                    @click.native.prevent="handleLogin(loginFormRef)"
                >登 录
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import defaultSettings from '@/settings.js'
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/store/user.js";
import {getPublicKey} from "@/api/user.js";
import illustrationBg from '@/assets/images/login/login-left-purple@2x.png'
// 验证信息
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error(' 请输入账号 '))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error(' 密码错误，请重新输入 '))
  } else {
    callback()
  }
}
// data数据
const loginData = reactive({
  loginForm: {
    phonenumber: '13048996241',
    password: 'admin123'
  },
  loginRules: {
    phonenumber: [{required: true, trigger: 'blur', validator: validateUsername}],
    password: [{required: true, trigger: 'blur', validator: validatePassword}]
  },
  loading: false,
  passwordType: 'password',
  redirect: undefined,
  // illustrationBg: require('@/assets/images/login/login-left-purple@2x.png')
  illustrationBg,
  keyPair: '' // 密码加密密钥
})
const loginFormRef = ref()
const route = useRoute()
const router = useRouter()
watch(route, (newName, oldName) => {
  loginData.redirect = newName.query && newName.query.redirect
});

onMounted(() => {
  getKeyPair()
})

// 是否显示密码
function showPwd() {
  if (loginData.passwordType === 'password') {
    loginData.passwordType = ''
  } else {
    loginData.passwordType = 'password'
  }
  // this.$nextTick(() => {
  //   this.$refs.password.focus()
  // })
}

// 获取密钥
function getKeyPair() {
  getPublicKey().then(res => {
    loginData.keyPair = res;
  })
}

const userStore = useUserStore()

function handleLogin(loginFormRef) {
  loginFormRef.validate(valid => {
    if (valid) {
      loginData.loading = true
      // 用户信息
      const userInfo = loginData.loginForm
      // 加密密钥
      const keyPair = loginData.keyPair
      userStore.login({userInfo, keyPair}).then(res => {
        router.push({path: this.redirect || '/'})
      }).catch(() => {
      }).finally(() => {
        loginData.loading = false
      })
    } else {
      console.log('登录失败！')
      return false
    }
  })
}
</script>
<script>
export default {
  name: 'Login',
  data() {

    return {}
  },

  methods: {}
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #fff;
$light_gray: #222;
$cursor: #6a65fc;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

h1, h3 {
  margin: 0;
  padding: 0;
}

.el-form-item__error {
  padding: 10px 0 0 14px !important;
  font-size: 14px;
  color: #FF4D4F !important;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 56px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 5px 5px 5px 15px;
      color: $light_gray;
      height: 56px;
      caret-color: $cursor;
      font-size: 16px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #222 !important;
      }
    }
  }

  .el-form-item {
    margin-bottom: 35px;
    //border: 1px solid #C4C4C4;
    border-bottom: 1px solid #DDE0E3;;
    color: #AFAFAF;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 20px;
    top: 16px;
    font-size: 18px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .login-btn {
    //width: 400px;
    width: 100%;
    height: 52px;
    background: #3B7CFF;
    border-radius: 4px;
    font-size: 18px;
  }
}

@media (min-width: 750px) {
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
      position: relative;
      width: 420px;
      max-width: 100%;
      overflow: hidden;
    }

    .form-info {
      margin-right: 120px;
    }

    .login-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1000px;
      height: 550px;
      background: #F5F8FC;
      box-shadow: 0 1px 23px 6px rgba(212, 226, 255, 0.69);
      border-radius: 8px;

      .illustration-img {
        margin: 34px 0 0 60px;
        width: 386px;
        height: 340px;

        img {
          margin: 0 0 0 -60px;
          width: 480px;
        }
      }

      .company-title {
        position: absolute;
        top: 18px;
        left: 120px;
        font-size: 30px;
        font-weight: 500;
        color: #1F2329;
      }

      .form-box {
        display: flex;
        justify-content: center;
        width: 520px;
        height: 550px;
        background: #fff;
        padding: 0 0 0 30px;

        & > div {
          margin-left: 80px;
        }

        h1 {
          margin: 98px 0 20px 150px;
          font-weight: 500;
          font-size: 28px;
          color: #333333;
          line-height: 40px;
        }

        h3 {
          margin: 0 0 50px 0;
          font-size: 22px;
          font-weight: 500;
          color: #AFAFAF;
        }
      }
    }
  }
  :deep(.el-form-item__content) {
    .el-input__wrapper {
      width: 420px;
      border: none !important;
    }
  }
}

@media (min-width: 0px) and (max-width: 750px) {
  .el-form-item__content {
    width: 100% !important;
    height: 20px;
  }
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-input {
      input {
        height: 20px !important;
        font-size: 14px;
      }
    }

    .illustration-img {
      display: none;
      margin-top: 10px;
    }

    .login-box {
      margin: 0 40px;
      height: 440px;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 3px 26px 6px rgba(35, 101, 244, 0.26);

      .form-box {
        height: 400px;
        padding: 0 30px 0;
        width: 360px;

        h1 {
          margin: 40px 0 20px 0;
          font-size: 26px;
          color: #333;
          font-weight: 500;
        }

        h3 {
          margin: 0 0 30px 0;
          font-size: 16px;
          font-weight: 500;
          color: #AFAFAF;
        }
      }

    }
  }
  :deep(.el-form-item__content) {
    .el-input__wrapper {
      width: 300px;
      border: none !important;
    }
  }
}

</style>
