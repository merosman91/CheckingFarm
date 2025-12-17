// ملف src/utils/dateUtils.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-SA')
}

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}
