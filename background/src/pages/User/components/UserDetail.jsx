import { formatDate, formatTime } from '@/utils/tools'
import { Descriptions, Image, Tag } from 'antd'

function UserDetail(props) {
  const items = [
    {
      label: '登录账号',
      children: <Tag color="red">{props.user.loginId}</Tag>
    },
    {
      label: '登录密码',
      children: <Tag color="magenta">{props.user.loginPwd}</Tag>
    },
    {
      label: '当前头像',
      children: <Image src={props.user.avatar} width={100} />
    },
    {
      label: '联系方式',
      children: (
        <Descriptions
          layout="vertical"
          size="small"
          items={[
            {
              label: 'QQ',
              children: props.user.qq || '未填写'
            },
            {
              label: '微信',
              children: props.user.wechat || '未填写'
            },
            {
              label: '邮箱',
              children: props.user.mail || '未填写'
            }
          ]}
        />
      )
    },
    {
      label: '个人简介',
      children: props.user.intro || '未填写'
    },
    {
      label: '时间信息',
      children: (
        <Descriptions
          layout="horizontal"
          size="small"
          column={1}
          bordered
          items={[
            {
              label: '注册时间',
              children: formatDate(props.user.registerDate)
            },
            {
              label: '上次登录',
              children: formatTime(props.user.lastLoginDate, '{y}-{m}-{d} {h}:{i}:{s} 星期{a}')
            }
          ]}
        />
      )
    },
    {
      label: '当前积分',
      children: <span>{props.user.points}分</span>
    }
  ]
  return (
    <>
      <Descriptions
        colon={false}
        layout="vertical"
        items={items}
        size="small"
        column={1}
        labelStyle={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#333'
        }}
      />
    </>
  )
}

export default UserDetail
