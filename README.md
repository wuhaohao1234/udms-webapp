# react搭建webpack

## 项目介绍

本项目是采用webpack搭建的react，集成了antd

本地配置请在app.js下的callApi，配置相应的域名

开源目的：方便更多的人学会项目架构

## 安装

1. 安装```Node.js``` >= 12.0
2. 打开终端进入到当前目录
3. 输入以下命令，安装依赖
```bash
npm i
```

## 开发模式
```bash
npm run dev   # 使用开发模式启动
npm run debug   # 使用调试模式启动，不会产生SourceMap和其它设置，可以增加打包速度
```
运行完成后，从本地浏览器访问对应的地址查看


## 打包
```bash
npm run build
```
打包输出到```./dist```目录

## 开发时的本地配置
```dev.config.yml```
```yaml
devServer:
  host: '0.0.0.0'  # 绑定的端口
  port: 8080  # 端口
  open: 'chrome' # 打开浏览器
  proxy:
    api: 项目域名xxx
```
