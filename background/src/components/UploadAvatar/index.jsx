import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Upload } from 'antd'
import { useState } from 'react'

function UploadAvatar(props) {
  const { message } = App.useApp()
  const [imageUrl, setImageUrl] = useState()
  const [loading, setLoading] = useState(false)
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8
        }}
      >
        {props.title}
      </div>
    </div>
  )

  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('上传大小不能超过2MB!')
    }
    return isLt2M
  }

  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      if (info.file.response.code !== 0) {
        message.error('上传失败，请重新上传')
        setImageUrl('')
      } else {
        message.success('上传成功')
        setImageUrl(info.file.response.data)
        // 实现与Form.Item的双向绑定
        props.onChange && props.onChange(info.file.response.data)
      }
    }
  }
  return (
    <>
      <Upload
        listType="picture-card"
        // showUploadList={false}
        maxCount={1}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={() => setImageUrl('')}
        onPreview={() => window.open(imageUrl, '_blank')}
      >
        {imageUrl ? null : uploadButton}
      </Upload>
    </>
  )
}

export default props => (
  <App>
    <UploadAvatar {...props} />
  </App>
)
