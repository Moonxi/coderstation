import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getInterviewTitle } from '../api/interview'

export const getInterviewTitleList = createAsyncThunk(
  'interview/getInterviewTitleList',
  async (_, thunkApi) => {
    const { data } = await getInterviewTitle()
    thunkApi.dispatch(initInterviewTitleList(data))
    return data
  }
)

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    interviewTitleList: [], // 存储所有的面试题标题
    interviewCache: {} // 面试题缓存
  },
  reducers: {
    initInterviewTitleList(state, action) {
      state.interviewTitleList = action.payload
    },
    // 更新面试题缓存
    updateInterviewCache(state, action) {
      state.interviewCache[action.payload._id] = action.payload
    }
  }
})

export const { initInterviewTitleList, updateInterviewCache } = interviewSlice.actions

export default interviewSlice.reducer
