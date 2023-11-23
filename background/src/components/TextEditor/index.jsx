import '@/locale/toast-ui-react-editor/zh-cn.js'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import COS from 'cos-js-sdk-v5'
import { useEffect, useRef } from 'react'

function TextEditor(props) {
  const editorRef = useRef()

  useEffect(() => {
    // 获取编辑器实例
    if (props.getInstance instanceof Function) {
      props.getInstance(editorRef.current.getInstance())
    }
    props.editorRef.current = editorRef.current.getInstance()
  }, [editorRef])

  useEffect(() => {
    // 数据回填
    if (props.value) {
      editorRef.current.getInstance().setHTML(props.value)
    }
  }, [])
  // 修改editor上传图片的方法
  async function handleAddImageBlob(blob, callback) {
    const cos = new COS({
      SecretId: 'AKID970kK5f6MYXLzQdbLtuhFhwwhEZkhPxI',
      SecretKey: 'Dk4LODnEUWJsEOL37zDF3fGetuiKj292'
    })
    const res = await cos.uploadFile({
      Bucket: 'images-1317947350',
      Region: 'ap-nanjing',
      Key: 'coderstation/' + blob.name,
      Body: blob,
      SliceSize: 1024 * 1024 * 5
    })
    callback('https://' + res.Location, blob.name)
  }
  return (
    <Editor
      initialValue=""
      previewStyle="vertical"
      height={props.height || '600px'}
      initialEditType="markdown"
      autofocus={false}
      useCommandShortcut={true}
      language="zh-CN"
      ref={editorRef}
      onChange={() => {
        if (props.onChange instanceof Function) {
          props.onChange(
            editorRef.current.getInstance().getMarkdown(),
            editorRef.current.getInstance().getHTML()
          )
        }
      }}
      hooks={{
        addImageBlobHook: handleAddImageBlob
      }}
    />
  )
}

export default TextEditor
