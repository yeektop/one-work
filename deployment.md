## 部署说明

本项目涉及以下技术栈

1. nodejs/npm
2. 原生微信小程序
3. Vant Weapp
4. 微信云开发



## 注意事项

本人开发时使用了 `VS Code` 中的 `minapp` 插件，指定了使用 `prettier` 进行格式化。相关的设置如下

```json
    "minapp-vscode.wxmlFormatter": "prettier", //指定格式化工具
    "minapp-vscode.prettier": { //prettier 更多参考https://prettier.io/docs/en/options.html
        // 需指定wxml 的 parser, 推荐 angular 进行处理
        "parser": "angular",
        "jsxBracketSameLine":true,
        "useTabs": false,
        "tabWidth": 2,
        "printWidth": 100,
        "singleQuote": false
    },
```



**prettier** 的格式化需要闭合标签，请注意兼容

如果你想在微信开发者工具中使用 `VS Code` 中的插件，请参照这个链接

[动手打造更强更好用的微信开发者工具-编辑器扩展篇](https://developers.weixin.qq.com/community/develop/article/doc/000a8816e18748dd52f96f8975b413)





## 部署教程

1. 克隆项目

```
git clone https://gitee.com/Moreant/tcb-hackthon-one-work.git
```

 2. 在微信开发者工具中导入该项目

 3. 在项目中的 **miniprogram**  目录下执行以下指令

    需要依赖 `npm` 或 `nodejs` 

```
npm install
```

 4. 构建 npm 包

打开微信开发者工具，点击 **工具 -> 构建 npm**，并勾选 **使用 npm 模块** 选项。

![img](https://img.yzcdn.cn/public_files/2019/08/15/fa0549210055976cb63798503611ce3d.png)



5. 部署 `getOpenId` 云函数

> 如果你尚未接触过云开发，请查看云开发的 [文档](https://tencentcloudbase.github.io/handbook/tcb21.html)



6. 创建数据库集合

此项目需要两个数据库集合 `userInfo` 和 `works` 

`userInfo` 目前非必须，存储用户信息

`works` 必须，存储作业信息。主要字段如下

```
_id: String 唯一字段
_openid: String 创建此文档用户的标识
context: String 作业正文
course: String 作业科目
end: timestamp 结束时间
create_time: timestamp 创建此文档的时间
status: Boolean 作业状态
title: String 作业标题
```

















