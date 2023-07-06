import { db, storage, auth } from './FirebaseSetup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, increment, limit, orderBy } from 'firebase/firestore'
import { collection, addDoc, getDocs, setDoc, where, query, updateDoc, getDoc, deleteDoc } from 'firebase/firestore'

export async function addData(path, data) {
  try {
    const docRef = await addDoc(collection(db, path), data)
    return docRef
  } catch (e) {
    console.log('Error adding document: ', e)
  }
}

export async function setData(path, id, data) {
  try {
    const docRef = await setDoc(doc(db, path, id), data)
    return docRef
  } catch (e) {
    console.log('Error adding document: ', e)
  }
}

export async function updateData(path, id, data) {
  try {
    const ref = doc(db, path, id)
    const docRef = await updateDoc(doc(db, path, id), data)
    return docRef
  } catch (e) {
    console.log('Error adding document: ', e)
  }
}

export async function readData(path) {
  const querySnapshot = await getDocs(collection(db, path))
  return querySnapshot
}
//account相关
export async function addAccount(data) {
  const docRef = await addDoc(collection(db, 'Account'), data)
  return docRef
}

//serviceprovider相关
export async function setServiceProvider(id, data) {
  console.log('执行了setServiceProvider', id, data)
  const providerRef = doc(db, 'ServiceProvider', id)
  console.log(providerRef)
  const docRef = await setDoc(providerRef, data)
  console.log(docRef)
  return docRef
}

export async function getServiceProviderById(id) {
  // console.log('执行了getServiceProviderNameById')
  console.log(id)
  const providerRef = collection(db, 'ServiceProvider')
  const q = query(providerRef, where('prv_id', '==', id))
  const snapshot = await getDocs(q)
  // console.log('-----', snapshot.docs[0].data()['prv_name'])
  return snapshot.docs.map(doc => doc.data())[0]
}

export async function getServiceProviderByApproved(appr) {
  const providerRef = collection(db, 'ServiceProvider')
  const q = query(providerRef, where('approved', '==', appr))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data())
}

export async function getServiceProviderNameById(id) {
  // console.log('执行了getServiceProviderNameById')
  console.log(id)
  const providerRef = collection(db, 'ServiceProvider')
  const q = query(providerRef, where('prv_id', '==', id))
  const snapshot = await getDocs(q)
  // console.log('-----', snapshot.docs[0].data()['prv_name'])
  return snapshot.docs.map(doc => doc.data())[0].prv_name
}

export async function addServiceProvider(data) {
  const docRef = await addDoc(collection(db, 'ServiceProvider'), data)
  // console.log(docRef)
  return docRef
}

//service相关
export async function getAllServices() {
  const querySnapshot = await getDocs(collection(db, 'Service'))
  // console.log(querySnapshot)
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
  }))
}

export async function getServicesById(id) {
  // TEST: 下面这段仅仅处理 测试数据，因为我测试数据的 srv_id 是
  // START
  if (id.split('-')[0] == '#srv') {
    // check if it is test data
    console.log('in getSerivceById, id: ', id)
    const q = query(collection(db, 'Service'), where('srv_id', '==', id))
    const snapshot = await getDocs(q) // query 语句一定要用 getDocs() 注意 s
    const ret = []
    snapshot.forEach(doc => {
      ret.push(doc.data())
    })
    return ret[0]
  }
  // END
  const serviceRef = doc(db, 'Service', id)
  const service = await getDoc(serviceRef)
  return service.data()
}

export async function updateServiceById(id, data) {
  const serviceRef = doc(db, 'Service', id)
  const service = await updateDoc(serviceRef, data)
  return service
}

export async function updateServiceRemainById(id, data) {
  const serviceRef = doc(db, 'Service', id)
  const service = await updateDoc(serviceRef, {
    remain: increment(1),
  })
  return service
}

export async function updateServiceProviderById(id, data) {
  const providerRef = doc(db, 'ServiceProvider', id)
  const provider = await updateDoc(providerRef, data)
  return provider
}

export async function addService(data) {
  const docRef = await addDoc(collection(db, 'Service'), data)
  const srv_id = docRef.id
  await updateDoc(docRef, { srv_id })
  // console.log(docRef)
  return docRef
}

export async function deleteService(id) {
  const docRef = await deleteDoc(doc(db, 'Service', id))
  return docRef
}

export async function deleteServiceProviderById(id) {
  const docRef = await deleteDoc(doc(db, 'ServiceProvider', id))
  return docRef
}

export async function getServicesByServiceProviderId(id) {
  const servicesRef = collection(db, 'Service')
  const q = query(servicesRef, where('prv_id', '==', id))
  const snapshot = await getDocs(q)

  const services = snapshot.docs.map(doc => ({
    ...doc.data(),
  }))
  return services
}

export async function getServicesByServiceProvider(name) {
  const servicesRef = collection(db, 'Service')
  const q = query(servicesRef, where('serviceprovider', '==', name))
  const snapshot = await getDocs(q)

  const services = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
  return services
}

//上传图片到storage

export async function uploadImage(image) {
  // 生成唯一的文件名
  const imageName = `${Date.now()}-${image.name}`
  const imageRef = ref(storage, 'images/' + imageName)
  const snapshot = await uploadBytes(imageRef, image).then(snapshot => {
    console.log('Uploaded an Image!')
  })
  const url = getDownloadURL(imageRef)
  return url
}

//上传图像
export async function uploadAvatar(avatar) {
  // 生成唯一的文件名
  const avatarName = `${Date.now()}-${avatar.name}`
  const avatarRef = ref(storage, 'avatars/' + avatarName)
  const snapshot = await uploadBytes(avatarRef, avatar).then(snapshot => {
    console.log('Uploaded an avatar!')
  })
  const url = getDownloadURL(avatarRef)
  return url
}

//上传视频
export async function uploadVideo(video) {
  // 生成唯一的文件名
  const videoName = `${Date.now()}-${video.name}`
  const videoRef = ref(storage, 'videos/' + videoName)
  const snapshot = await uploadBytes(videoRef, video).then(snapshot => {
    console.log('Uploaded a video!')
  })
  const url = getDownloadURL(videoRef)
  return url
}

//request相关
export async function getRequestsByServiceProvider(id) {
  const requestsRef = collection(db, 'Request')
  const q = query(requestsRef, where('serviceprovider', '==', 'testprovider'))
  const snapshot = await getDocs(q)

  const requests = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
  return requests
}

export async function getRequestsByServiceProviderId(id) {
  const requestsRef = collection(db, 'Request')
  const q = query(requestsRef, where('prv_id', '==', id))
  const snapshot = await getDocs(q)

  const requests = snapshot.docs.map(doc => ({
    ...doc.data(),
  }))
  return requests
}

export async function getRequestById(id) {
  const requestRef = doc(db, 'Request', id)
  console.log('执行了getRequestById')
  const request = await getDoc(requestRef)
  return request
}

//获取所有request
export async function getAllRequests() {
  const querySnapshot = await getDocs(collection(db, 'Request'))
  // console.log(querySnapshot)
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
  }))
}

export async function updateRequestById(id, data) {
  const requestRef = doc(db, 'Request', id)
  const request = await updateDoc(requestRef, data)
  return request
}

// 检查服务是否还可被request
/*
 * request time 只填写开始时间
 * 有 remain 字段，不需要再写 检查时间是否重复了
 * 有 remain 就一定有工人可以提供服务，任何时间都可以
 */
// export async function checkSrvAvailability(srv_id, time) {
//   const duration = getServicesById(srv_id).duration
//   const Request = collection(db, 'Request')
//   const q = query(Request, where('srv_id', '==', srv_id), where('req_time', '==', time))
// }

// add request
export async function addRequest(data) {
  const docRef = await addDoc(collection(db, 'Request'), data)
  // console.log(docRef)
  await updateDoc(docRef, {
    req_id: docRef.id,
  })

  // serivce.remain - 1
  const q = query(collection(db, 'Service'), where('srv_id', '==', data.srv_id))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnapshot => {
    console.log('Finding remain', docSnapshot.id, docSnapshot.data())
    updateDoc(doc(db, 'Service', docSnapshot.id), {
      remain: docSnapshot.data().remain - 1,
    })
  })
  return docRef
}

export async function addFakeRequest(n) {
  // const req_id = '#req001' // TODO: 设计成自增
  // req_time = new Date().getTime()
  for (let i = 0; i < n; i++) {
    let data = {
      req_id: 'test' + i,
      user_id: 'testuser' + i,
      srv_id: 'testsrv' + i,
      prv_id: 'GP91I5ic6tR69lTVmIIbA8RAJmd2',
      desc: 'des' + i,
      req_time: new Date().getTime(),
      status: 'pending',
    }
    const docRef = await addDoc(collection(db, 'Request'), data)
    const req_id = docRef.id
    await updateDoc(docRef, { req_id })
  }
  console.log('add fake request done')
}

export async function addFakeReview(n) {
  let fakeReviewList = []
  for (let i = 0; i < n; i++) {
    fakeReviewList.push({
      rvw_id: `#rvw-test-${i}`,
      srv_id: `#srv-test-${i}`, // 对应的 service
      author: {
        user_id: `#user-test-${i}`, // str
        user_name: 'Tester', // str
        user_avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
      },
      title: `Service Review Title - ${i}`,
      content: 'We supply a series of cleaning resources, to help people clean their home beautifully and efficiently.',
      rate: 5, // int, 0-5, 🌟级评分
      likes: 777, // int, 点赞数👍
      date: Date.now(),
    })
    await addDoc(collection(db, 'Review'), fakeReviewList[i])
  }
  console.log('add ', n, ' fake review done')
}
// FAKE data start
// Generate and add fake data of: Service, ServiceProvider
export async function addFakeData(n) {
  let fakeServiceList = []
  let fakeProviderList = []
  let fakeReviewList = []
  let fakeNotificationList = []
  for (let i = 0; i < n; i++) {
    let gps = [-1.4001991, 50.9434623]
    gps[0] += 0.0001 * (5 + i)
    gps[1] += 0.0001 * (5 + i)

    fakeServiceList.push({
      srv_id: `srv-test-${i}`,
      category: 'Cleaning',
      srv_name: 'Kitchen Cleaning', // str, service name
      description: 'This is the description of Kitchen Cleaning',
      // prv_id: `#prv-test-${i}`, // str, provider id
      prv_id: 'GP91I5ic6tR69lTVmIIbA8RAJmd2', // str, provider id
      prv_name: `Provider Company-${i}`, // str, provider name
      videos: ['https://www.youtube.com/watch?v=kr0RisHSDwI'], // array, to dispaly service, optional
      imgs: [
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean1.png?alt=media&token=96c9e206-9cbf-4716-9eaa-d5e97768a409',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean2.png?alt=media&token=a88307aa-c6c8-4301-acaf-b292619d9938',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean3.png?alt=media&token=35523b64-6fb8-4e02-8cc8-880d3aa53724',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean4.png?alt=media&token=15035f3e-f818-4ce7-9d0c-68e78f6da207',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean5.png?alt=media&token=7f2ccd77-8728-4b50-b5c8-0d02a6b719b5',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean6.png?alt=media&token=8d6de684-c4aa-4d1e-a490-c12e43411323',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean7.png?alt=media&token=2cd41515-7003-4c6a-8eff-2f5ca461a549',
      ], // array, `mandatory`, at least 1 img
      price: 100, // int, service price
      location: {
        txt: 'Highfeild', // str, e.g., service only available within Highfeild
        gps: gps, // [经度，纬度]，要求根据位置找到服务【到时候我们应该要用GoogleMap的API】
      },
      available_time: ['Mon', 'Tue'], // array, 最好 TimePiker 让商家选
      duration: 30, // int, 30min，指定服务预计时长，这个参数将是 request 的时间选择间隔
      total: 5, // int, 同一服务在同一时间段可以被请求的次数（e.g. 清洁工人数）
      remain: 5,
      reputation: 3.5, // float, 服务评分
    })
    fakeProviderList.push({
      approved: false,
      needupdate: false,
      prv_id: `prv-test-${i}`, // str, provider id
      prv_name: `Provider Company-${i}`, // str, provider name
      description: `This is the description of Provider Company-${i}`,
      email: 'prefix@suffix.domain', // str
      phone: '07579966529', // str
      password: 'testpwd', // password hash, 不明文存储密码，存储加盐的哈希值（我之后写进util，可以先存明文）
      location: {
        txt: 'SO16 3UJ Glen Eyre Hall', // str, provider's address text
        gps: gps, // array, [经度，纬度] 按照 GoogleMap 来
      },
      avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`, // img url, 商家头像
      imgs: [
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean1.png?alt=media&token=96c9e206-9cbf-4716-9eaa-d5e97768a409',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean2.png?alt=media&token=a88307aa-c6c8-4301-acaf-b292619d9938',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean3.png?alt=media&token=35523b64-6fb8-4e02-8cc8-880d3aa53724',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean4.png?alt=media&token=15035f3e-f818-4ce7-9d0c-68e78f6da207',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean5.png?alt=media&token=7f2ccd77-8728-4b50-b5c8-0d02a6b719b5',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean6.png?alt=media&token=8d6de684-c4aa-4d1e-a490-c12e43411323',
        'https://firebasestorage.googleapis.com/v0/b/test-36dcf.appspot.com/o/images%2FClean7.png?alt=media&token=2cd41515-7003-4c6a-8eff-2f5ca461a549',
      ], // array, 用于呈现商家主页的推销图片（顾客可以点击商家头像，查看商家主页）
    })
    // fakeReviewList.push({
    //   rvw_id: `#rvw-test-${i}`,
    //   srv_id: `#srv-test-${i}`, // 对应的 service
    //   author: {
    //     user_id: `#user-test-${i}`, // str
    //     user_name: 'Tester', // str
    //     user_avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
    //   },
    //   title: `Service Review Title - ${i}`,
    //   content: 'We supply a series of cleaning resources, to help people clean their home beautifully and efficiently.',
    //   rate: 5, // int, 0-5, 🌟级评分
    //   likes: 777, // int, 点赞数👍
    //   date: Date.now(),
    // })
    fakeNotificationList.push({
      msg_id: `#msg-test-${i}`,
      msg_type: i % 2 == 0 ? 'review' : 'update', // str, 取值应为 ['review', 'update' ]
      user_id: 'xRv9DqSlQRcK7Mpd2Z98wCLYmPs1',
      user_name: 'Monica',
      srv_id: `#srv-test-${i}`,
      srv_name: 'Test Data',
      prv_name: 'Test Data',
      msg_title: '[Test] Please review/see new feature', // str
      msg_body:
        '[Test] Please review/see new feature[Test] Please review/see new featurev[Test] Please review/see new feature', // str
      time: Date.now(), // timestamp
      isRead: false,
      jumpLink: '/', // use to navigate to review or new service
    })
    fakeReviewList.push({
      rvw_id: `#rvw-sample-${i}`,
      srv_id: `#srv-test-${i}`, // 对应的 service
      author: {
        user_id: `#user-test-${i}`, // str
        user_name: 'SampleReview', // str
        user_avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
      },
      title: `Sample Review Title`,
      content: 'This is a great service and deserves 5 stars!',
      rate: 5, // int, 0-5, 🌟级评分
      likes: 777, // int, 点赞数👍
      date: Date.now(),
    })
    fakeNotificationList.push({
      msg_id: `#msg-test-${i}`,
      msg_type: i % 2 == 0 ? 'review' : 'update', // str, 取值应为 ['review', 'update' ]
      user_id: 'YyOVUmCZFcYqB6xU4KA8g0JIXlk1',
      user_name: 'Monica',
      srv_id: `#srv-test-${i}`,
      srv_name: 'Test Data',
      prv_name: 'Test Data',
      msg_title: '[Test] Please review/see new feature', // str
      msg_body:
        '[Test] Please review/see new feature[Test] Please review/see new featurev[Test] Please review/see new feature', // str
      time: Date.now(), // timestamp
      isRead: false,
      jumpLink: '/', // use to navigate to review or new service
    })
    // await addDoc(collection(db, 'Service'), fakeServiceList[i])
    // await addDoc(collection(db, 'ServiceProvider'), fakeProviderList[i])
    await addDoc(collection(db, 'Review'), fakeReviewList[i])
    // await addDoc(collection(db, 'Notification'), fakeNotificationList[i])
  }
  // console.log('Generating fake data of: Service, ServiceProvider, Review, Notification')
  console.log('Generating sample data of: Review')
}

export async function addNotification(data) {
  const docRef = await addDoc(collection(db, 'Notification'), data)
  const msg_id = docRef.id
  await updateDoc(docRef, { msg_id })
  return docRef
}
export async function addFakeRequestData(n) {
  let fakeRequestList = []
  for (let i = 0; i < n; i++) {
    fakeRequestList.push({
      req_id: `#req-test-${i}`, // str, request id
      user_id: `#usr-test-${i}`, // str, user id
      srv_id: `#srv-test-${i}`, // str, service id
      desc: 'This is the description of request', // str, request description
      req_time: new Date(), // datetime, request time
      req_status: 'pending', // str, request status, pending, accepted, rejected, completed
    })
    await addDoc(collection(db, 'Request'), fakeRequestList[i])
    const req_id = docRef.id
    await updateDoc(docRef, { req_id })
  }
  console.log('Generating fake data of: Request')
}
// FAKE data end

export async function getRecommendServices(amount = 12) {
  const q = query(
    collection(db, 'Service'),
    // TODO: order by reputation(rate)
    orderBy('srv_id'), // orderBy('', 'desc')
    limit(amount)
  )
  const querySnapshot = await getDocs(q)

  // console.log(querySnapshot)

  let ret = []
  querySnapshot.forEach(doc => {
    // console.log(doc.id, '=>', doc.data())
    // ret.push({ srv_id: doc.data().srv_id, imgUrl: doc.data().imgs[0] })
    ret.push(doc.data())
  })
  // console.log(ret)

  return ret
}

export async function getSearchedServices(possibleCats) {
  const q = query(collection(db, 'Service'), where('category', 'in', possibleCats))
  const querySnapshot = await getDocs(q)

  // console.log(querySnapshot)
  const ret = []
  querySnapshot.forEach(doc => {
    // console.log(doc.id, '=>', doc.data())
    ret.push(doc.data())
  })

  console.log('Search results', ret)
  return ret
}

export async function addCustomer(data) {
  const docRef = await addDoc(collection(db, 'Customer'), data)
  console.log('User successfully added')
}

export async function getAllReviews() {
  const q = query(collection(db, 'Review'))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })
  return ret
}

export async function deleteReviewById(id) {
  const q = query(collection(db, 'Review'), where('rvw_id', '==', id))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(doc => {
    deleteDoc(doc.ref)
  })
}
export async function getReviews(srv_id) {
  const q = query(collection(db, 'Review'), where('srv_id', '==', srv_id))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  // console.log('Review data: ', ret)
  return ret
}

export async function getReviewById(id) {
  const q = query(collection(db, 'Review'), where('rvw_id', '==', id))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  // console.log('Review data: ', ret)
  return ret
}

export async function addReview(data) {
  const docRef = await addDoc(collection(db, 'Review'), data)
  await updateDoc(docRef, {
    rvw_id: docRef.id,
  })
  console.log('Review successfully added')

  return docRef
}

export async function getCustomer(user_id) {
  const q = query(collection(db, 'Customer'), where('user_id', '==', user_id))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  console.log('Get customer: ', ret[0])

  return ret[0]
}

export async function changeCustomerEmail(user_id, newEmail) {
  const q = query(collection(db, 'Customer'), where('user_id', '==', user_id))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnapshot => {
    updateDoc(doc(db, 'Customer', docSnapshot.id), {
      email: newEmail,
    })
  })
}

export async function changeCustomerNamePhone(user_id, newName, newPhone) {
  const q = query(collection(db, 'Customer'), where('user_id', '==', user_id))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnapshot => {
    updateDoc(doc(db, 'Customer', docSnapshot.id), {
      user_name: newName,
      phone: newPhone,
    })
  })
}

export async function getRequestHistory(user_id) {
  const q = query(collection(db, 'Request'), where('user_id', '==', user_id))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(docSnapshot => {
    ret.push(docSnapshot.data())
  })

  return ret
}

export async function getNotifications(user_id) {
  const q = query(
    collection(db, 'Notification'),
    where('user_id', '==', 'All'),
    orderBy('isRead'),
    orderBy('time', 'desc')
  )
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  // console.log('Review data: ', ret)
  return ret
}

//展示相关
export async function getServiceCountByProviderId(id) {
  const q = query(collection(db, 'Service'), where('prv_id', '==', id))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size
}

export async function getRequestCountByProviderId(id) {
  const q = query(collection(db, 'Request'), where('prv_id', '==', id))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size
}

export async function getStatusRequestCountByProviderId(id) {
  const pendingQ = query(collection(db, 'Request'), where('prv_id', '==', id), where('status', '==', 'pending'))
  const pending_querySnapshot = await getDocs(pendingQ)
  const pendingCnt = pending_querySnapshot.size
  const acceptedQ = query(collection(db, 'Request'), where('prv_id', '==', id), where('status', '==', 'accepted'))
  const accepted_querySnapshot = await getDocs(acceptedQ)
  const acceptedCnt = accepted_querySnapshot.size
  const rejectedQ = query(collection(db, 'Request'), where('prv_id', '==', id), where('status', '==', 'rejected'))
  const rejected_querySnapshot = await getDocs(rejectedQ)
  const rejectedCnt = rejected_querySnapshot.size
  const completedQ = query(collection(db, 'Request'), where('prv_id', '==', id), where('status', '==', 'completed'))
  const completed_querySnapshot = await getDocs(completedQ)
  const completedCnt = completed_querySnapshot.size
  const detailQ = query(collection(db, 'Request'), where('prv_id', '==', id), where('status', '==', 'needDetail'))
  const detail_querySnapshot = await getDocs(detailQ)
  const detailCnt = detail_querySnapshot.size
  return [pendingCnt + detailCnt, acceptedCnt, rejectedCnt + completedCnt]
}
export async function setNotificationStatus(msg_id) {
  const q = query(collection(db, 'Notification'), where('msg_id', '==', msg_id))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(docSnapshot => {
    console.log('Message read, set isRead=true')
    updateDoc(doc(db, 'Notification', docSnapshot.id), {
      isRead: true,
    })
  })
}

export async function addRequestDetails(req_id, details) {
  const q = query(collection(db, 'Request'), where('req_id', '==', req_id))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach(docSnapshot => {
    console.log('Adding request details..., docsnapshot: ', docSnapshot.data())
    updateDoc(doc(db, 'Request', docSnapshot.id), {
      desc: docSnapshot.data().desc + ' ' + details,
      status: 'pending', // NOTE: needDetail -> pending
    })
  })
}

export async function withDrawRequest(req_id) {
  const q = query(collection(db, 'Request'), where('req_id', '==', req_id))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach(docSnapshot => {
    console.log('WithDraw request')
    updateDoc(doc(db, 'Request', docSnapshot.id), {
      status: 'withdrawn', // request when withdrawn
      isReviewed: true, // withdrawn request donnot need review， set true to ignore review
    })
  })
}

// sample data
export async function getSampleServiceData() {
  const q = query(collection(db, 'Service'), where('prv_id', '==', 'MT6yz4QPzCbNSk4BaEiGeCkpyzr1'))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  console.log('Sample service data: ', ret)
  // return ret
}

export async function getSampleReviewData() {
  const q = query(collection(db, 'Review'), where('title', '==', 'Sample Review Title'))
  const querySnapshot = await getDocs(q)
  const ret = []
  querySnapshot.forEach(doc => {
    ret.push(doc.data())
  })

  console.log('Sample review data: ', ret)
  // return ret
}
