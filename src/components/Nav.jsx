import { MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { getLoginUserId } from '../utils/LoginInfo'
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  }
}

const App = () => {
  const loginUserId = getLoginUserId()
  const onClick = e => {
    console.log('click ', e)
  }
  return (
    <Menu
      theme='dark'
      mode='inline'
      // defaultSelectedKeys={['1']}
      items={[
        {
          key: '1',
          label: <Link to='/account'>account</Link>,
        },
        {
          key: '2',
          label: <Link to='/service'>service</Link>,
        },
        {
          key: '3',
          label: <Link to='/request'>request</Link>,
        },
        {
          key: '4',
          label: (
            <Link
              to='/request'
              onClick={() => {
                localStorage.removeItem('loginID')
                localStorage.removeItem(loginUserId)
              }}>
              logout
            </Link>
          ),
        },
      ]}
    />
  )
}
export default App
