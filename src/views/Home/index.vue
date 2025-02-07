<template>
  <!-- <ACard> </ACard> -->
  <div class="home" v-if="isShow1 == 1" v-loading.fullscreen.lock="SSOLoginFlag">
    <!-- <img src="" alt="" /> -->

    <div style="flex: 3; height: 100%; display: flex; flex-direction: column">
      <div style="flex: 1.5; width: 100%"></div>
      <div class="button">
        <div class="card card1">
          <div class="but" @click="jumpTo('/VoiceToText')">语音转文本</div>
        </div>
        <div class="card card2">
          <div class="but" @click="jumpTo('/textToSpeech')">文本转语音</div>
        </div>
        <div class="card card3">
          <div class="but" @click="jumpTo('/aiSoundGeneration')">AI音效</div>
        </div>
      </div>
      <div style="flex: 0.5"></div>
      <div style="flex: 1.5; justify-content: center; text-align: center">
        <div style="font-size: 16px; color: #555; align-content: center; user-select: none">
          请遵守<span @click="jumpOutUrl(userxieyi)" class="bianse">《用户协议》</span>及<span @click="jumpOutUrl(yinsizhengce)" class="bianse"
            >《隐私政策》</span
          >
        </div>
      </div>
    </div>
    <div class="home-back">
      <div class="wellcome"></div>
      <div class="vedio" v-if="!isPlayVideo">
        <div class="title">一分钟了解语音模型网关</div>
        <Lottie :animationOptions="videoAnimation" :styles="videoStyles" @click="changePlayVideo(true)"></Lottie>
        <!-- <div style="width: 100%; padding-right: 100px">
          <div
            class="iconfont icon-start-full"
            style="
              font-size: 60px;
              z-index: 999;
              cursor: pointer;
              height: 70px;
              text-align: center;
              align-content: center;
              width: 70px;
              float: right;
              background: linear-gradient(to top right, #1190fb, #98eaf2ff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            "
            @click="changePlayVideo(true)"
          ></div>
        </div> -->
      </div>
      <div v-else class="vedio boxshadow">
        <video
          ref="videoRef"
          style="width: 100%; object-fit: fill; height: 100%; z-index: 999"
          controls
          type="video/mp4"
          src="@/assets/video/Made with FlexClip.mp4"
        ></video>
        <div
          style="
            position: absolute;
            width: 100%;
            top: 0px;
            text-align: end;
            padding-right: 15px;
            z-index: 9999;
            color: white;
            font-size: 25px;
            height: 35px;
            opacity: 0.8;
          "
        >
          <span style="cursor: pointer" @click="changePlayVideo(false)">×</span>
        </div>
      </div>
      <div style="flex: 1.5; max-height: 150px; width: 80%; font-size: 14px; text-align: center; align-content: end; padding-bottom: 10px">
        Copyright2024 © 软通智算科技(广东)集团有限公司 版权所有
      </div>
    </div>
  </div>
  <div v-else-if="isShow1 == 0" class="home1"></div>

  <div v-else class="login-card">
    <div class="login-card-small">
      <div class="login-label">欢迎登录</div>
      <el-form ref="ruleFormRef" label-width="0" :model="loginParams" :rules="loginRules" @keyup.enter="onSubmit">
        <el-form-item class="user-item" style="margin-bottom: 40px" name="username" prop="username">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱地址或电话号码"
            v-model="loginParams.username"
            :prefix-icon="() => h(ElIcon, { color: '#fff', size: 25 }, { default: () => h(AIcon, { icon: 'icon-dengluzhanghao' }) })"
          />
        </el-form-item>
        <el-form-item class="user-item" style="margin-bottom: 30px" prop="password">
          <el-input
            size="large"
            type="password"
            placeholder="请输入登录密码"
            show-password
            :prefix-icon="() => h(ElIcon, { color: '#CCCCCC', size: 25 }, { default: () => h(AIcon, { icon: 'icon-denglumima' }) })"
            v-model="loginParams.password"
          />
        </el-form-item>
        <!-- <el-form-item class="remember-item">
            <div><el-checkbox v-model="rememberMe" label="记住密码" size="large" /></div>
          </el-form-item> -->
        <el-form-item class="check-item">
          <div v-show="isShowCheckText" class="check-item-text">
            <div :class="{ 'check-item-text-warn': checkWarn }">{{ alertText }}</div>
          </div>
        </el-form-item>
        <el-form-item class="submit-item">
          <el-button :class="{ shake: isShaking }" size="large" class="login-submit-button" type="primary" @click="onSubmit()">{{
            '登录'
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '/Home',
});
import Lottie from '@/components/Lottie/Lottie.vue';
import '@/styles/iconfont/iconfont.css';
import { computed, nextTick } from 'vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const isShow1 = computed(() => userStore.sysStatus);
const isPlayVideo = ref(false);
const videoRef = ref();
const changePlayVideo = (boo: boolean) => {
  if (boo) {
    isPlayVideo.value = boo;
    nextTick(() => {
      videoRef.value.play();
    });
  } else {
    isPlayVideo.value = boo;
    videoRef.value.pause();
  }
};
import { ref, reactive, h, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import JSEncrypt from 'jsencrypt';
import { FormRules, FormInstance, ElIcon, ElMessage, ElMessageBox } from 'element-plus';
import { User, Unlock, Iphone } from '@element-plus/icons-vue';
import { useLocalStorage } from '@/utils/storage';
import { loginCode, getPublicKey, getUserAndPP } from '@/api/setting/user';
import { useEdit } from './hook/useEdit';
const isShowCheckText = ref(false);
const checkWarn = ref(false);
const isShaking = ref(false);
const alertText = ref('请输入正确的邮箱地址或手机号码');
const router = useRouter();
const storage = useLocalStorage();
const { pwdLevel, editFormRef, editFormList, userAndPp, editFormData, editHandleSync, editFormLoading, editFormRules, isShowEditDialog } = useEdit();
const loginParams = reactive({
  username: storage.get('username') || '',
  password: storage.get('password') || '',
  loginType: 1,
  // captchaId: '',
  // captcha: ''
});
const phoneParams = reactive({
  phone: '',
  captcha: '',
});

const jumpTo = (str: string) => {
  router.push({ name: str });
};
const SSOLoginFlag = ref(false);
const phone = ref('');
const timer = ref();
const seconds = ref(60);
const captchaFlag = ref(true);
const authStatus = ref<number>(1);
const ruleFormRef = ref<FormInstance>();
const phoneFormRef = ref<FormInstance>();
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { required: true, message: '密码长度在6-15之间', trigger: 'blur' },
  ],
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});
const phoneRules = reactive<FormRules>({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

// const resetForm = () => {
//   ruleFormRef.value?.resetFields();
//   loginParams.username = '';
//   loginParams.password = '';
// };

const getCaptcha = () => {
  if (!phoneParams.phone) {
    ElMessage.warning('联系管理员添加手机号');
    return;
  }
  if (phoneParams.phone.length !== 11) {
    ElMessage.warning('手机号错误请联系管理员');
    return;
  }
  loginCode({ phone: phone.value }).then((res) => {
    if (res.success) {
      ElMessage.success('验证码发送成功！');
      captchaFlag.value = false;
      timer.value = setInterval(() => {
        if (seconds.value <= 1) {
          captchaFlag.value = true;
          seconds.value = 60;
          clearInterval(timer.value);
        } else {
          seconds.value--;
        }
      }, 1000);
    } else {
      ElMessage.error(res.msg || '验证码发送失败！');
    }
  });
};
const userxieyi = ref('');
const yinsizhengce = ref('');
const onSubmit = async () => {
  // if (!storage.get('RSAToken')) {
  //   const res = await getPublicKey();
  //   if (res.success && res.data) {
  //     storage.set('RSAToken', res.data);
  //   } else {
  //     ElMessage.error(res.msg || '获取公钥失败');
  //     return;
  //   }
  // }
  if (loginParams.username == '') {
    isShowCheckText.value = true;
    alertText.value = '请输入正确的邮箱地址或手机号码';

    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }
  if (loginParams.password == '') {
    isShowCheckText.value = true;
    alertText.value = '请填写登录密码';

    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }
  if (authStatus.value === 1) {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        loginHandle();
      }
    });
  } else {
    phoneFormRef.value?.validate((valid) => {
      if (valid) {
        loginHandle();
      }
    });
  }
};

const loginHandle = () => {
  return;
};

const rememberMe = ref<boolean>(storage.get('rememberMe') || false);
const rememberPassword = () => {
  storage.set('rememberMe', rememberMe.value);
  if (rememberMe.value) {
    storage.set('username', loginParams.username);
    storage.set('password', loginParams.password);
  } else {
    storage.remove('username');
    storage.remove('password');
  }
};

const editSubmit = () => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (editFormData.value.newPassword !== editFormData.value.againPassword) {
        ElMessage.warning('两次密码不一致');
      } else if (editFormData.value.newPassword === editFormData.value.oldPassword) {
        ElMessage.warning('新旧密码相同');
      } else if (editFormData.value.newPassword.indexOf(loginParams.username) > -1) {
        ElMessage.warning('新密码不能包含用户名');
      } else {
        ElMessageBox.confirm('确认重置密码?').then(() => {
          editHandleSync().then(() => {
            isShowEditDialog.value = false;
            router.push('/login');
          });
        });
      }
    }
  });
};

const resetPassword = () => {
  isShowEditDialog.value = true;
  editFormData.value = {
    loginName: loginParams.username,
  };
};

const queryURLParams = function queryURLParams(URL = window.location.href) {
  const url = URL.split('?')[1];
  if (url == undefined && !store.sysUser) {
    router.push('/login');
  }
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  history.replaceState(null, '', URL.split('?')[0]);
  return params;
};
const store = useUserStore();
const SSOLogin = async () => {
  //检查本地存储是否有token
  //1.有token则调用获取用户信息接口
  if (storage.get('token')) {
    if (!store.sysUser) {
      await store.getSysUser();
    }
  } else {
    //2.没有token则调取获取登录信息接口
    //2-1.sysuser有信息则不掉
    if (!store.sysUser) {
      const { state, code } = queryURLParams();
      if (state && code) {
        SSOLoginFlag.value = true;

        await store.sysUserInit(state, code).then(
          (data) => {
            // 执行成功回调
            SSOLoginFlag.value = false;
          },
          (reason) => {
            // 执行失败回调
            if (reason === 'no-groups') {
              ElMessage({
                showClose: true,
                message: '没有检测到有效的groups,请尝试换个账号重新登录!',
                type: 'error',
                duration: 0,
              });
              setTimeout(() => {
                store.removeLoginInfo();
              }, 3000);
            }
          },
        );
      }
    }
  }
};
const getUrl = async () => {
  const res = await getUserAndPP();
  userxieyi.value = res.data.user_agreement;
  yinsizhengce.value = res.data.privacy_policy;
};
//跳转
const jumpOutUrl = (url: string) => {
  window.open(url);
  return;
};
// getUrl();
import animationData from '@/assets/videoAnimation.json';
const videoAnimation = {
  animationData: animationData,
};
const videoStyles = {
  position: 'absolute',
  width: '700px',
  top: '140px',
  cursor: 'pointer',
  borderRadius: '350px',
  // height: '100%',
};
onMounted(() => {
  SSOLogin().then(() => {
    getUrl();
  });
});

onBeforeUnmount(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.home {
  // background: #ffffff;
  // background-size: 310px 300px;
  height: 100%;
  display: flex;
  overflow-x: hidden;
  // justify-content: center;
  align-items: center;
  // flex-direction: column;
  background: url('@/assets/image/home/homebackground.png');
  //background-size: 310px 300px;
  background-size: cover;
  .home-back {
    // width: 1500px;
    flex: 7;
    padding-top: 20px;
    // padding: 0px 340px;
    height: 100%;
    display: flex;
    margin: 0;

    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }
  .wellcome {
    flex: 1.5;
    max-height: 100px;
    background: url('@/assets/image/home/hometitle.png') no-repeat;
    background-position-x: center;
    width: 80%;
    align-content: center;
  }
  .vedio {
    width: 80%;
    // max-width: 1000px;
    flex: 7;
    background: url('@/assets/image/home/homebg.png') no-repeat;
    background-position-y: calc(100% - 125px);
    overflow: hidden;
    border-radius: 10px;
    background-size: 100% 280px;
    border: 1px solid transparent;
    background-clip: padding-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    position: relative;

    .title {
      height: 80%;
      padding-top: 4%;
      font-size: 26px;
      align-content: start;
    }
    span {
      height: 15%;
      display: block;
      padding-left: calc(100% - 100px);
      cursor: pointer;
    }
  }

  .button {
    // width: 800px;
    font-size: 14px;
    flex: 6.5;
    font-weight: 700;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    // max-width: 1000px;
    user-select: none;
    justify-content: space-between;
    align-items: center;
    .card {
      cursor: pointer;
      width: 400px;
      height: 120px;
      font-size: 26px;
      border-radius: 19px;
      align-content: center;
      text-align: center;
      position: relative;
      background-size: 100% 100%;
    }
    .card1 {
      background-image: url('@/assets/image/home/asr.png');
      box-shadow: 0px 0px 10px rgb(0, 0, 255, 0.15);
    }
    .card2 {
      background-image: url('@/assets/image/home/tts.png');
      box-shadow: 0px 0px 10px rgb(132, 0, 15, 0.15);
    }
    .card3 {
      background-image: url('@/assets/image/home/aisound.png');
      box-shadow: 0px 0px 10px rgb(190, 81, 233, 0.15);
    }
  }
}
.home1 {
  background: url('@/assets/image/home/u126.svg') no-repeat center center;
  background-size: 600px 600px;
  height: 100%;
}

.login-card {
  position: absolute;
  top: 45%;
  left: 58%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 600px;
  padding: 20px 25px;
  display: flex;
  flex-direction: column;
  background-color: rgba(251, 230, 232, 0.5);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  // border: solid 1px #3081c580;
  .login-card-small {
    width: 600px;
    height: 500px;
    // padding: 50px;
    border-radius: 15px;
    box-shadow: 2px 2px 2px 1px rgba(170, 170, 170, 0.35);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
  }
  // text-align: center;
  .login-label {
    color: #333;
    font-size: 20px;
    // margin: 8px 0 15px 0;
    margin-bottom: 50px;
    margin-top: 50px;
    font-weight: 700;
  }
  .user-item {
    .el-input {
      width: 400px;
      height: 50px;
      :deep(input) {
        margin-left: 10px;
        // color: #fff;
      }
      :deep(.el-input__wrapper:hover) {
        box-shadow: 0 0 0 1px #d70010;
      }

      // :deep(input::placeholder) {
      //   color: #fff;
      // }
      // :deep(.el-input__wrapper) {
      //   background-color: #01132f;
      //   box-shadow: 0 0 0 1px #3081c580 inset;
      //   font-size: 14px;
      // }
    }
  }
  .captcha-item {
    margin-bottom: 40px;
    .captcha-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .login-captcha-input {
        width: 120px;
        height: 30px;
        :deep(input) {
          color: #fff;
        }
        :deep(input::placeholder) {
          color: rgba(255, 255, 255, 0.5);
        }
        :deep(.el-input__wrapper) {
          background-color: #01132f;
          box-shadow: 0 0 0 1px #3081c580 inset;
          font-size: 13px;
        }
        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px #3081c580 inset;
        }
      }
      .login-captcha-img {
        width: 60px;
        height: 30px;
        overflow: hidden;
        border-radius: 3px;
        img {
          width: 100%;
          height: 100%;
          background-color: #f5f7fa;
        }
      }
      .login-reset-button {
        width: 53px;
        height: 30px;
        background-color: transparent;
        color: rgba(255, 255, 255, 0.5);
        border: solid 1px #3081c580;
        font-size: 13px;
      }
    }
  }
  .login-phone-button {
    background-color: transparent;
    border: 0;
    color: #fff;
  }
  .check-item {
    width: 400px;
    height: 40px;
    .check-item-text {
      background-color: #fff5e6;
      border: 1px solid #ffebcc;
      color: #ff9900;
      padding-left: 20px;
      border-radius: 5px;
      width: 100%;
      .check-item-text-warn {
        color: #f56c6c;
      }
    }
  }
  // .remember-item {
  //   margin-bottom: 0px;
  //   :deep(.el-checkbox__inner) {
  //     border: solid 1px #3081c580;
  //   }
  // }
  .submit-item {
    width: 100%;
    margin-top: 30px;
    .login-submit-button {
      width: 400px;
      height: 50px;
      color: #fff;
      background-color: #d7000f;
      font-size: 18px;
      font-weight: 700;
      border-radius: 15px;
      border: none;

      &:hover {
        background-color: rgb(215, 0, 15, 0.5);
      }
    }
  }
}

.shake {
  animation: jump 0.5s linear infinite;
}
@keyframes jump {
  0% {
    transform: translate(0px, 1px);
  }
  10% {
    transform: translate(0, -2px);
  }
  20% {
    transform: translate(0, 2px);
  }
  30% {
    transform: translate(0, -4px);
  }
  40% {
    transform: translate(0, 4px);
  }
  50% {
    transform: translate(0, -4px);
  }
  60% {
    transform: translate(0, 4px);
  }
  70% {
    transform: translate(0, -2px);
  }
  80% {
    transform: translate(0, 2px);
  }
  90% {
    transform: translate(0, -1px);
  }
  100% {
    transform: translate(0, 0);
  }
}
.login-card {
  // position: relative;
  // .border_corner {
  //   z-index: 10;
  //   position: absolute;
  //   width: 30px;
  //   height: 30px;
  //   background: rgba(0, 0, 0, 0);
  //   border: 3px solid #04b3e5;
  // }
  .border_corner_left_top {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }
  .border_corner_right_top {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
  }
  .border_corner_left_bottom {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
  }
  .border_corner_right_bottom {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }
}
.bianse:hover {
  color: #d7000f;
  cursor: pointer;
  text-decoration: underline;
  text-underline-position: under;
}
.bianse {
  // color: #d7000f;
  transition: all 0.2s;
}
</style>
