
# First introduction video

- Title:
  - 【latexdiff.cn】一键生成pdf，展示latex项目修改
  - [latexdiff.cn] Generate a pdf showing the changes of latex projects online!
- publication: Youtube(Chinese and English version) Bilibili (Chinese version)
- advertisement：
  - English: Reddit, Medium, twitter
  - Chinese: 知乎，微博，微信，小红书，CSDN，v2ex
  - https://github.com/ftilmann/latexdiff 宣传？

（网站主界面作为背景，上面标注latexdiff.cn网站地址）

给大家介绍一个在线使用latexdiff展示latex项目修改的pdf网站。上传新旧版本的latex项目的压缩包，然后就可以生成一个展示修改的pdf了。

This is an online website that allows you to display modifications made to LaTeX projects using latexdiff. 

Upload the old and new versions of your LaTeX project.

Check the option to download the diff project.

Click the submit button.

You will get a generated PDF displaying the modifications.

We have red and strike out for deleted text.

new text is displayed in blue.

new figure has a blue frame.

Download the diff project here.

So that you can modify and compile it locally.

We support changing the styles for the new and deleted text.

If you don't want to upload your project, 

you can also run it locally using a single command.

## 【latexdiff.cn】一键生成pdf，展示latex项目修改

![website.png](https://pic4.zhimg.com/v2-352dc294401ec6dc659d9c2de4f41b66_r.jpg)

给大家介绍一个在线使用latexdiff展示latex项目修改的pdf网站。上传新旧版本的latex项目的压缩包，然后就可以生成一个展示修改的pdf了。

- 网站：[https://latexdiff.cn](https://latexdiff.cn)
- 源码与教程：[https://github.com/am009/git-latexdiff-web](https://github.com/am009/git-latexdiff-web)

如果使用的是overleaf，可以直接上传overleaf上下载的压缩包。

![overleaf_download_project.png](https://pic4.zhimg.com/v2-928e18252d3bbab2b4da59152d5de80f_r.jpg)

功能上，我们支持仅显示新增的内容，以及任意修改颜色和样式。

- 仅显示新增的内容
- 任意修改颜色，可以添加删除线或者波浪下划线。（其他样式开发中）
- 新增的图表用边框标注显示

![functions.png](https://pic4.zhimg.com/v2-8f95bdc1871d96ee717d037e07cc144b_r.jpg)

使用场景：

- 当你想要看看哪里有变化
- 论文的审稿意见为 major/minor revision 时，可以使用这个和上一个版本对比生成一个diff（作为参考）。

如果你不想上传自己的项目，可以通过命令行一键在本地运行。

如果你不想暴露自己的latex源码，可以自己跑一个diff后端并在网页填入本地的API地址，文件不会被发送到外部。或者使用我们命令行版本的latexdiff，一行docker命令即可在本地运行。

有任何意见欢迎去issue或者discussion评论。

## [latexdiff.cn] Generate a pdf showing the changes of latex projects online!

This is my new website that allows users to display modifications made to LaTeX projects using latexdiff. Users can upload zip files of the old and new versions of their LaTeX projects, and the website will run latexdiff to generate a PDF that showcases the modifications.

Website: [https://latexdiff.cn](https://latexdiff.cn)

Source code and tutorials: [https://github.com/am009/git-latexdiff-web](https://github.com/am009/git-latexdiff-web)

If you use Overleaf, you can directly upload the source zip file downloaded from Overleaf.

Functionalities:

- Displaying only the added text
- Customizing the colors and styles, including adding strikethrough or wavy underlines
- New figures have a blue frame

Use cases for this website include:

- Reviewing changes made to a project
- Generating a diff (as a reference) for comparing major/minor revisions during paper review.

If you prefer not to upload your own project, you can run it locally through the command line.

If you wish to keep your LaTeX source code private, you can run a diff backend locally and enter the local API address in the website. The files will not be sent externally. Alternatively, you can use the command line version of latexdiff by running a single Docker command locally.

Feel free to provide any feedback or suggestions. Just comment in Github discussions or raise issues.
