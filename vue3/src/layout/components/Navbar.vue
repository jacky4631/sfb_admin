<template>
  <div class="navbar">
    <Hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <Search id="header-search" class="right-menu-item" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="user.avatar || Avatar" class="user-avatar">
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/user/center">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="open">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Avatar from '@/assets/images/avatar.png'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'Navbar' })

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const user = computed(() => userStore)

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

const open = () => {
  userStore.LogOut().then(() => {
    location.reload()
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: var(--top-tool-height);
  overflow: hidden;
  position: relative;
  background: var(--top-header-bg-color);
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: var(--top-header-hover-color);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: var(--top-header-text-color);
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: var(--top-header-hover-color);
        }
      }
    }

    .avatar-container {
      margin-right: 16px;

      .avatar-wrapper {
        margin-top: 0;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon {
          cursor: pointer;
          position: absolute;
          right: -16px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
