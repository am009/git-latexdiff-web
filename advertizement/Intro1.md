
# First introduction video

- publication: Youtube(Chinese and English version) Bilibili (Chinese version)
- advertisement：
  - English: Reddit, twitter
  - Chinese: 知乎，微博，微信，小红书，CSDN
  - https://github.com/ftilmann/latexdiff 宣传？
  - v2ex 宣传，链接放到 readme 。

（网站主界面作为背景，上面标注latexdiff.cn网站地址）

给大家介绍一个在线使用latexdiff展示latex项目修改的pdf软件。上传新旧版本的latex项目的压缩包，然后就可以生成一个展示修改的pdf了。

（展示overleaf的下载压缩包界面截图）

如果使用的是overleaf，可以直接上传overleaf上下载的压缩包。

（网站主界面作为背景）

功能上，我们支持

- 仅显示新增的内容
- 任意修改颜色，可以添加删除线或者波浪下划线。（其他样式开发中）
- 新增的图表用边框标注显示

使用场景：

- 当你想要看看哪里有变化
- 论文的审稿意见为 major/minor revision 时，可以使用这个和上一个版本对比生成一个diff（作为参考）。

如果你不想暴露自己的latex源码，可以自己跑一个diff后端并在网页填入本地的API地址，文件不会被发送到外部。或者使用我们命令行版本的latexdiff，一行docker命令即可在本地运行。

快收藏起来吧，如果对你有用欢迎一键三连！有任何意见欢迎在issue区评论。
