<template>
  <div class="login-view">
    <el-card body-style="width: 400px; padding: 30px">
      <!-- :model="loginRules" :rules="loginRules"-->
      <el-form v-if="!showRegistry" ref="loginForm">
        <h2
          style="text-align: center; margin-bottom: 30px; letter-spacing: 3px"
        >
          后台登录
        </h2>
        <el-form-item prop="username">
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model.trim="form.username"
          >
            <i slot="prefix" class="el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model.trim="form.password"
            show-password
          >
            <i slot="prefix" class="el-icon-key"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- <el-form v-else :rules="registryRules" ref="registryForm"> -->
      <el-form v-else ref="registryForm">
        <h2
          style="text-align: center; margin-bottom: 30px; letter-spacing: 3px"
        >
          账号注册
        </h2>
        <el-form-item prop="registryType">
          <el-input
            type="text"
            v-model="registryForm.account"
            :placeholder="`请输入${registryType}`"
          >
            <el-select
              slot="prepend"
              v-model="registryType"
              label="文本"
              style="width: 80px"
            >
              <el-option value="电话">
                <i class="el-icon-phone"></i>
                手机
              </el-option>
              <el-option value="邮箱">
                <i class="el-icon-message"></i>
                邮箱
              </el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item porp="username">
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model="registryForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="registryForm.password"
            prefix-icon="el-icon-key"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-key"
            v-model="registryForm.confirmPassword"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" align="center">
        <el-button
          type="primary"
          size="medium"
          :plain="showRegistry"
          @click="login"
          :loading="loginLoading"
        >
          登录
        </el-button>
        <el-button
          type="warning"
          size="medium"
          :plain="!showRegistry"
          @click="registry"
          :loading="registryLoading"
        >
          注册
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { userLoginApi, userRegistryApi } from '@/api/userApi'
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      registryType: '电话',
      registryForm: {
        username: '',
        account: '',
        registryType: '', // phone-电话; email-邮箱
        password: '',
        confirmPassword: '',
      },
      showRegistry: false,
      loginLoading: false,
      registryLoading: false,
      loginRules: {
        account: [
          {
            required: true,
            message: '请输入电话或邮箱',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
          },
          {
            pattern: /^[A-z|0-9]{6,255}$/,
            message: '密码需要为 6-255 位的任意数字、字母或/.',
          },
        ],
      },
      registryRules: {},
    }
  },
  computed: {},
  filters: {},
  methods: {
    login() {
      //   this.$refs.loginForm.validate(valid => {
      //     console.log(valid)
      //   })
      if (!this.showRegistry) {
        if (this.form.username.length > 0 && this.form.password.length > 0) {
          this.loginLoading = true
          userLoginApi(this.form)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '登录成功',
                })
                this.$store.dispatch('setCurrentUser', res.data)
                this.$router.replace('/admin')
              } else {
                this.$message({
                  type: 'error',
                  message: res.message,
                })
              }
              this.loginLoading = false
            })
            .catch(() => {
              this.loginLoading = false
            })
        }
      } else {
        this.showRegistry = false
      }
    },
    registry() {
      if (this.showRegistry) {
        this.registryForm.registryType = this.transferRegistryType(
          this.registryType
        )
        this.registryLoading = true
        userRegistryApi(this.registryForm)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '注册成功',
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              })
            }
            this.registryLoading = false
          })
          .catch(() => {
            this.loginLoading = false
          })
      } else {
        this.showRegistry = true
      }
    },
    transferRegistryType() {
      switch (this.registryType) {
        case '电话':
          return 'phone'
        case '邮箱':
          return 'email'
      }
    },
  },
}
</script>

<style scoped>
.login-view {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  background-image: linear-gradient(to right bottom, #81ecec, #0984e3);
}
</style>
