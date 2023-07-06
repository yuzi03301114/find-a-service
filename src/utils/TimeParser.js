export function timestamp2DateStr(timestamp) {
  const date = new Date(timestamp) // 使用时间戳创建Date对象
  const year = date.getFullYear() // 获取年份
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 加一后补零
  const day = date.getDate().toString().padStart(2, '0') // 获取日期，需补零
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const dateString = `${hours}:${minutes} - ${day}/${month}/${year}` // 拼接成指定格式的日期字符串

  return dateString
}
