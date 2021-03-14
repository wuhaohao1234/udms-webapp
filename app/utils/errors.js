'use strict';


export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error {
  constructor(code, detail) {
    super(code);
    this.name = 'ApiError';
    this.code = code;
    this.detail = detail;
  }
}

export class HttpError extends Error {
  constructor(statusCode, statusText) {
    super(statusCode + ' ' + statusText);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}