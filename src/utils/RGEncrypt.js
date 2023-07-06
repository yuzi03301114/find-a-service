import CryptoJS from 'crypto-js'

const key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5('notosnikculnusgr').toString())
const iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(key).toString().substr(0, 16))

function base64dec(base64text) {
  const words = CryptoJS.enc.Base64.parse(base64text)
  return words.toString(CryptoJS.enc.Utf8)
}

function base64enc(text) {
  const words = CryptoJS.enc.Utf8.parse(text)
  const base64text = CryptoJS.enc.Base64.stringify(words)
  return base64text
}

export function encrypt(data) {
  let encrypted = ''
  if (data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    })
  }
  return base64enc(encrypted.toString())
}

export function decrypt(message) {
  if (!message) {
    return ''
  }
  const m = base64dec(message)
  let decrypted = ''
  decrypted = CryptoJS.AES.decrypt(m, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}
