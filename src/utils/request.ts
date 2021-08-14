/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import { server } from '../../config/server';
import { history } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    if (response.status === 401 || response.status === 403) {
      if (window.location.pathname !== '/user/login') {
        history.push(`/user/login`);
      }
      return response;
    }

    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Lỗi ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Không thể kết nối với máy chủ, vui làm kiểm tra kết nối của bạn',
      message: 'Sự Cố Mạng',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const AntRequest = extend({
  errorHandler, // 默认错误处理
  requestType: 'json',
  prefix: `${server.host}/api`,
  headers: { 'Content-Type': 'application/json'}
});

class Request {
  getToken = () => localStorage.getItem('token') || ""

  public get = (url: string, queryparams: any = {}) => {
    const queryString = Object.keys(queryparams).length > 0 ? "?" + Object.keys(queryparams).map(key => `${key}=${queryparams[key]}`).join('&') : '';
    return AntRequest(url + queryString, { headers: {authorization: this.getToken()}})
  }

  public post = (url: string, options?: RequestOptionsInit) => {
    const headers = options ? (options.headers || {}) : {};
    return AntRequest.post(url, {...options, headers: {...headers, authorization: this.getToken()}})
  }

  public put = (url: string, options?: RequestOptionsInit) => {
    const headers = options ? (options.headers || {}) : {};
    return AntRequest.put(url, {...options, headers: {...headers, authorization: this.getToken()}})
  }
}

const request = new Request();
export default request;
