import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeCurType } from '../redux/typeSlice'
import { Tag } from 'antd'

export default function TypeSelect() {
  const { typeList } = useSelector(state => state.type)
  const dispatch = useDispatch()
  const colorArr = ['#108ee9', '#2db7f5', '#f50', 'green', '#87d068', 'blue', 'red', 'purple']

  function selectAllHandle() {
    dispatch(changeCurType('all'))
  }
  function selectHandle(typeId) {
    dispatch(changeCurType(typeId))
  }
  return (
    <div>
      <Tag
        color="magenta"
        style={{ cursor: 'pointer' }}
        value="all"
        key="all"
        onClick={selectAllHandle}
      >
        全部
      </Tag>
      {typeList.map((t, index) => (
        <Tag
          color={colorArr[index % colorArr.length]}
          style={{ cursor: 'pointer' }}
          value={t._id}
          key={t._id}
          onClick={() => selectHandle(t._id)}
        >
          {t.typeName}
        </Tag>
      ))}
    </div>
  )
}
