<template>
  <div class="login">
    <div class="login-con">
      <Card>
        <p slot="title">
          <Icon type="ios-ionitron-outline"></Icon>
          欢迎
        </p>ssss
        <!-- <a href="#"
           slot="extra"
           @click.prevent="changeModel">
          {{showTip}}
        </a>
        <login-form @on-success-valid="login"
                    v-if="isLogin"></login-form>
        <register-form @on-success-valid="register"
                       v-else-if="!isLogin"></register-form> -->
        <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
      </Card>
    </div>
  </div>
</template>

<script>
// import LoginForm from '_c/login-form'
// import RegisterForm from '_c/register-form'
// import { mapActions } from 'vuex'
// import { register } from '@/api/user'

export default {
  components: {
    // LoginForm,
    // RegisterForm
  },
  data () {
    return {
      showTip: '去注册',
      isLogin: true,
      loginType: 'uc'
    }
  },
  methods: {
    // ...mapActions([
    //   'handleLogin',
    //   'getUserInfo'
    // ]),
    // login ({ account, password, loginType }) {
    //   let userAgent = window.navigator.userAgent
    //   if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('Android') > -1) {
    //     this.handleLogin({ account, password, loginType }).then(res => {
    //       this.$router.push({
    //         name: 'mobileView'
    //       })
    //     })
    //   } else {
    //     this.handleLogin({ account, password, loginType }).then(res => {
    //       this.$router.push({
    //         name: 'home',
    //         params: {
    //           id: 1
    //         }
    //       })
    //     })
    //   }
    // },
    // async register ({ account, password, nickname }) {
    //   const result = await register({
    //     account,
    //     password,
    //     nickname
    //   })
    //   this.$Message.info(result.msg)
    //   if (result.action === 'success') {
    //     this.changeModel()
    //   }
    // },
    // changeModel () {
    //   this.isLogin = !this.isLogin
    //   if (this.isLogin) {
    //     this.showTip = '去注册'
    //   } else {
    //     this.showTip = '去登录'
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
//   background-image: url('../../assets/images/bg.jpg');
  background-size: cover;
  background-position: center 100%;
  position: relative;
  &-con {
    position: absolute;
    right: 50%;
    top: 50%;
    transform: translate(50%, -60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
    .ivu-card-head {
      background-color: #f5f5f5;
    }
  }
}

</style>