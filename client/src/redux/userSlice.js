import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { editUserById, getUserById } from '../api/user'

export const editUser = createAsyncThunk('user/editUser', async payload => {
  await editUserById(payload.id, payload.data)
  const { data } = await getUserById(payload.id)
  return data
})

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    userInfo: {}
  },
  reducers: {
    // 初始化用户信息
    initUserInfo(state, action) {
      state.userInfo = action.payload
    },
    // 修改用户登录状态
    changeLoginStatus(state, action) {
      state.isLogin = action.payload
    },
    // 清除用户信息
    clearUserInfo(state, action) {
      state.userInfo = {}
    }
  },
  extraReducers: builder => {
    // 修改用户信息
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.userInfo = action.payload
    })
  }
})

export const { initUserInfo, changeLoginStatus, clearUserInfo } = userSlice.actions
export default userSlice.reducer
