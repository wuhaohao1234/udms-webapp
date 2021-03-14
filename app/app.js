'use strict';

import { EventEmitter } from 'events';
import { createHashHistory } from 'history';
import axios from 'axios';
import { NetworkError, ApiError, HttpError } from './utils/errors';
import Menu from './utils/menu';
import errorTips from './conf/error-tips.yml';
import menu from './conf/permission.yml';

class App extends EventEmitter {
  _router = createHashHistory();
  _env = {};
  _menu = new Menu(menu);

  /**
   * @typedef UserInfo
   * @property {string} token 用户令牌
   */
  /**
   * 记录的当前登录的用户信息
   * @type {UserInfo}
   */
  _loggedInUser = undefined;

  /** 全局进度指示器的引用计数 */
  _globalProgressBarRef = 0;

  constructor() {
    super();
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      this._loggedInUser = JSON.parse(loggedInUser);
    }
  }
  

  get env() { return this._env; }
  get router() { return this._router; }
  get menu() { return this._menu; }

  /**
   * 全局进度器是否正在展示
   */
  isGlobalProgressVisible() {
    return this._globalProgressBarRef > 0;
  }

  /**
   * 展示全局进度器
   */
  showGlobalProgressBar() {
    ++this._globalProgressBarRef;
    if (this._globalProgressBarRef === 1) {
      this.emit('APP::GLOBAL_PROGRESS_BAR_DISPLAY_CHANGED', true);
    }
  }

  /**
   * 隐藏全局进度器
   */
  hideGlobalProgressBar() {
    if (this._globalProgressBarRef === 0) {
      return;
    }
    --this._globalProgressBarRef;
    if (this._globalProgressBarRef === 0) {
      this.emit('APP::GLOBAL_PROGRESS_BAR_DISPLAY_CHANGED', false);
    }
  }

  /**
   * 检测用户是否已经登录了
   * @returns {boolean}
   */
  isUserLoggedIn() {
    return this._loggedInUser != undefined;
  }

  /**
   * 获取当前登录的用户的信息
   * @returns {UserInfo}
   */
  getLoggedInUser() {
    return this._loggedInUser;
  }

  /**
   * 用户登陆操作
   * @param {UserInfo} user 
   */
  login(data) {
    if (this.isUserLoggedIn()) {
      throw new Error('replicated login');
    }
    this._loggedInUser = {
      ...data
    };
    localStorage.setItem('loggedInUser', JSON.stringify(this._loggedInUser));
    this.emit('APP::USER_LOGIN_STATUS_CHANGED');
  }

  /**
   * 用户登出操作
   */
  logout() {
    if (!this.isUserLoggedIn()) {
      throw new Error('not login yet!');
    }
    this._loggedInUser = undefined;
    localStorage.removeItem('loggedInUser');
    this.emit('APP::USER_LOGIN_STATUS_CHANGED');
  }

  /**
   * @typedef RequestOptions
   * @property {*} data 上传的数据
   * @property {*} params URL参数
   * @property {string} version 接口版本号
   * @property {string} loadingMode 展示全局进度器的模式
   * @property {boolean} carryToken 是否携带token
   * @property {number} timeout 超时时间控制 毫秒
   * @property {number[]} handleErrorCodes 需要由外部处理的错误代码
   */
  /**
   * 
   * @param {string} method 
   * @param {string} path 
   * @param {RequestOptions} options 
   */
  callApi(method, path, { data, params, payload, version, loadingMode, carryToken, timeout, handleErrorCodes }) {
    const headers = {};
    if (carryToken) {
      const user = this.getLoggedInUser();
      if (!user || !user.token) {
        throw new TypeError(`Can't use token before login!`);
      }
      headers['X-Api-Authorization'] = user.token;
    }
    if (loadingMode == undefined) {
      loadingMode = true;
    }
    headers['X-Api-Version'] = version;
    return Promise.resolve()
      .then(() => {
        if (loadingMode)
          this.showGlobalProgressBar();
      })
      .then(() => {
        return axios.request({
          responseType: 'json',
          method,
          baseURL: 'http://localhost:80',
          url: path,
          headers,
          timeout: Number.isSafeInteger(timeout) ? timeout : 10000,
          data: data || payload,
          params,
        })
        .catch(e => {
          const res = e.response;
          if (res) {
            alert('HTTP Status Code ' + e.response.status + ' ' + e.response.statusText);
            return new HttpError(res.status, res.statusText);
          } else {
            return Promise.reject(e);
          }
        });
      })
      .finally(() => {
        if (loadingMode)
          this.hideGlobalProgressBar();
      })
      .then(res => {
        if (res instanceof Error) {
          return [res];
        }
        const errCode = res.headers['X-Api-Error-Code'.toLowerCase()];
        if (!errCode) {
          return [undefined, res.data];
        }
        const ret = [new ApiError(errCode, res.data), res.data];
        if (!Array.isArray(handleErrorCodes) || !handleErrorCodes.find(p => p === errCode)) {
          let msg = `[${errCode}]:   ${errorTips.api[errCode] || '未知错误'}`;
          if (errCode == 'ERR_BAD_REQUEST') {
            if (res.data && res.data.message) {
              msg += '\n\n' + res.data.message.toString();
            }
            console.log(res.data);
          }
          alert(msg); // Handle Error by default
        }
        return ret;
      });
  }
};

export default App;