import axios from 'axios'
const token = JSON.parse(
  localStorage.getItem('quiz-appState') !== null
    ? localStorage.getItem('quiz-appState')
    : '[]'
)

const axiosClient = axios.create()

axiosClient.defaults.baseURL = 'http://localhost:4000/api/admin'

axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: token.accessToken
}

//All request will wait 10 seconds before timeout
axiosClient.defaults.timeout = 10000

// axiosClient.defaults.withCredentials = true

export function getRequest(URL) {
  return axiosClient.get(`/${URL}`).then(response => response)
}

export function postRequest(URL, payload) {
  return axiosClient.post(`/${URL}`, payload).then(response => response)
}

export function patchRequest(URL, payload) {
  return axiosClient.patch(`/${URL}`, payload).then(response => response)
}

export function deleteRequest(URL) {
  return axiosClient.delete(`/${URL}`).then(response => response)
}
