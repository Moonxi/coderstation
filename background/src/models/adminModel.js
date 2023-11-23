import AdminController from '@/services/admin'

export default {
  // 命名空间
  namespace: 'admin',
  // state
  state: {
    adminList: [], // 管理员列表
    adminInfo: null // 当前登录的管理员信息
  },
  // reducers 同步操作
  reducers: {
    initAdminList(state, action) {
      return {
        ...state,
        adminList: action.payload
      }
    },
    initAdminInfo(state, action) {
      return {
        ...state,
        adminInfo: action.payload
      }
    }
  },
  // effects 异步操作
  effects: {
    *_initAdminList(_, { call, put }) {
      // 调用接口获取管理员列表
      const { data } = yield call(AdminController.getAdmin)
      // 更新本地仓库
      yield put({
        type: 'initAdminList',
        payload: data
      })
    },
    *_editAdmin({ payload }, { call, put }) {
      // 调用接口修改管理员
      yield call(AdminController.editAdmin, payload.id, payload.data)
      // 更新本地仓库
      yield put({
        type: '_initAdminList'
      })
    },
    *_deleteAdmin({ payload }, { call, put }) {
      // 调用接口删除管理员
      yield call(AdminController.deleteAdminById, payload.id)
      // 更新本地仓库
      yield put({
        type: '_initAdminList'
      })
    },
    *_addAdmin({ payload }, { call, put }) {
      // 调用接口新增管理员
      const res = yield call(AdminController.addAdmin, payload)
      // 更新本地仓库
      yield put({
        type: '_initAdminList'
      })
    }
  }
}
