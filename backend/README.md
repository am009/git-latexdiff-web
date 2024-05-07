# latexdiff web backend

To build the docker image

```
docker build . --tag am009/latexdiff-web-backend --build-arg UBUNTU_MIRROR=mirrors.ustc.edu.cn --build-arg PYTHON_MIRROR=pypi.tuna.tsinghua.edu.cn
```

To run the image: (remember to mount /tmp and docker socks.)

```
docker run -p 8000:8000 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp --name latexdiff-backend -d am009/latexdiff-web-backend
```
