<p align="center">
    简约清新的 Work TODO 
</p>



## 项目名称

**一作业**



## 项目介绍

> 基于 **原生微信小程序** + **Vant Weapp** 开发，后端使用**微信云开发**



在中学时期，只需要看一眼黑板就能知道最近的作业了。

但到了大学，没有固定的教室意味着学习委员再也不能把作业写在“黑板”上了

**一作业** 就是针对这个场景而推出的，学习委员可以在 **一作业** 上添加作业，其他同学们收到分享，添加到自己的作业清单中。

这样就避免了

1. 忘记某项作业
2. 同学们都来问学委作业






## 体验二维码

![](/QRCode.png)



## 分支命名

随便命名，注意提交规范即可，不过推荐参照提交规范，如

fate/add home page:  添加home页面

fix/msg page navigate:  修复 msg 的导航问题



## 提交规范

建议使用 [Commitizen](https://github.com/commitizen/cz-cli) 来规范提交，[安装教程](https://segmentfault.com/a/1190000020924364)

- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动



## 发布流程

由于使用了 **[conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)**，发布流程如下：

1. 完成功能/bug后，使用变基精简提交
2. 拉取 github 中的 dev 分支
3. 使用变基合并到本地 dev 分支，处理冲突，确保工作区干净
4. 执行 `npm version major|minor|patch` （对应版本号中的 major.minor.patch）增加版本号
5. 产生changelog `conventional-changelog -p angular -i CHANGELOG.md -s ` 修改样式，提交CHANGELOG.md
6. 合并到 master 分支，打上 Tags
7. 推送云端






## LICENSE

[MIT](LICENSE)



