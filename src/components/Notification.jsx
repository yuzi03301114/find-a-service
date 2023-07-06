import { notification } from 'antd'
const openNotification = (title, description, callback) => {
  notification.open({
    message: title,
    description: description,
    onClick: callback,
  })
}
export default openNotification
