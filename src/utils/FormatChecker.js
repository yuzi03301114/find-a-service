// Email, Password format checker

export function checkEmailFormat(returnPatternOnly = true, email = null) {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (returnPatternOnly) return regx
  return regx.test(email)
}

export function checkPasswordFormat(returnPatternOnly = true, password = null) {
  // length >= 6
  // must contain at leaset 1 number, 1 letter, 1 special character
  const regx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/
  if (returnPatternOnly) return regx
  return regx.test(password)
}

export function checkUKPhoneFormat(returnPatternOnly = true, phone = null) {
  const regx = /^(0|\+44)\s?\d{2,5}\s?\d{6,8}$/
  if (returnPatternOnly) return regx
  return regx.test(phone)
}
