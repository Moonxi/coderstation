import { useRef, useEffect } from 'react'
import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '../locale/toast-ui-react-editor/zh-cn.js'
import COS from 'cos-js-sdk-v5'

export default function TextEditor(props) {
  const editorRef = useRef()

  useEffect(() => {
    // 获取编辑器实例
    if (props.getInstance instanceof Function) {
      props.getInstance(editorRef.current.getInstance())
    }
  }, [editorRef])
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
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      language="zh-CN"
      ref={editorRef}
      onChange={() => {
        if (props.onChange instanceof Function) {
          props.onChange(
            editorRef.current.getInstance().getHTML(),
            editorRef.current.getInstance().getMarkdown()
          )
        }
      }}
      hooks={{
        addImageBlobHook: handleAddImageBlob
      }}
    />
  )
}
