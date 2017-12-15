import axios from 'axios';
import qs from 'qs';
axios.defaults.baseURL = window.BASE_URL;
const request = (url, method, data) => {
	// axios.defaults.baseURL = url;
	// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
	axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	return axios[method](url, qs.stringify(data));
};

const fetch = (url, data) => {
	return request(url, 'get', data);
};

const post = (url, data) => {
	return request(url, 'post', data);
};

const put = (url, data) => {
	return request(url, 'put', data);
};

const deleteItem = url => {
	return request(url, 'delete');
};

export { fetch, post, put, deleteItem };
