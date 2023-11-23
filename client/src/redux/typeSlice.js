import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getType } from '../api/type'

export const getTypeList = createAsyncThunk('type/getTypeList', async () => {
  const { data } = await getType()
  return data
})
const typeSlice = createSlice({
  name: 'type',
  initialState: {
    typeList: [], // 存储所有的类型
    curType: 'all' // 当前选中的类型
  },
  reducers: {
    // 更改当前选中的类型
    changeCurType(state, action) {
      state.curType = action.payload
    }
  },
  // 专门处理异步的reducers
  extraReducers: builder => {
    builder.addCase(getTypeList.fulfilled, (state, action) => {
      state.typeList = action.payload
    })
  }
})

export const { changeCurType } = typeSlice.actions
export default typeSlice.reducer
