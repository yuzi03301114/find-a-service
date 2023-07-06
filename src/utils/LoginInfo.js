import { getServiceProviderNameById } from '../utils/FirebaseAPI'
export const getLoginUserId = () => {
  // for (let i = 0; i < localStorage.length; i++) {
  //   const key = localStorage.key(i)
  //   if (key.includes('f-a-s:')) {
  //     return key.split(':')[1]
  //   }
  // }
  // return null
  return localStorage.getItem('loginID')
}

export const getLoginUserName = async () => {
  const useId = getLoginUserId()
  let name = await getServiceProviderNameById(useId)
  return name
}
