import TypeController from '@/services/type'

export default {
  // 命名空间
  namespace: 'type',
  // state
  state: {
    typeList: [] // 类型列表
  },
  // reducers 同步操作
  reducers: {
    initTypeList(state, action) {
      return {
        ...state,
        typeList: action.payload
      }
    }
  },
  // effects 异步操作
  effects: {
    *_initTypeList(_, { call, put }) {
      // 调用接口获取类型列表
      const { data } = yield call(TypeController.getTypeList)
      // 更新本地仓库
      yield put({
        type: 'initTypeList',
        payload: data
      })
    },
    *_editType({ payload }, { call, put }) {
      // 调用接口修改类型
      yield call(TypeController.editType, payload.id, payload.data)
      // 更新本地仓库
      yield put({
        type: '_initTypeList'
      })
    },
    *_deleteType({ payload }, { call, put }) {
      // 调用接口删除类型
      yield call(TypeController.deleteType, payload.id)
      // 更新本地仓库
      yield put({
        type: '_initTypeList'
      })
    },
    *_addType({ payload }, { call, put }) {
      // 调用接口新增类型
      const res = yield call(TypeController.addType, payload)
      // 更新本地仓库
      yield put({
        type: '_initTypeList'
      })
    }
  }
}
