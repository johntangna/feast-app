import axios from "axios"

const service = axios.create({
	baseURL: "/adminapi",
	timeout: 180000
})

service.interceptors.request.use(
	config => {
		return config
	},
	err => {
		return Promise.reject(err)
	}
)

service.interceptors.response.use(
	res => {
		return res
	},
	err => {
		return Promise.reject(err)
	}
)

export default service