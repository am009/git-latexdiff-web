FROM ubuntu:24.04

# docker build . --tag am009/latexdiff-web-backend --build-arg UBUNTU_MIRROR=mirrors.ustc.edu.cn --build-arg PYTHON_MIRROR=pypi.tuna.tsinghua.edu.cn
ARG UBUNTU_MIRROR
# =mirrors.ustc.edu.cn
ARG PYTHON_MIRROR
# =pypi.tuna.tsinghua.edu.cn

SHELL ["/bin/bash", "-c"]
WORKDIR /root

ENV PIP_BREAK_SYSTEM_PACKAGES=1

RUN if [[ ! -z "$UBUNTU_MIRROR" ]] ; then sed -i "s/archive.ubuntu.com/$UBUNTU_MIRROR/g" /etc/apt/sources.list.d/ubuntu.sources && \
 sed -i "s/security.ubuntu.com/$UBUNTU_MIRROR/g" /etc/apt/sources.list.d/ubuntu.sources ; fi && \
 apt update && DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends docker.io tar coreutils jq wget curl nano sudo \
 net-tools time python3 python3-pip python-is-python3 && \
 if [[ ! -z "$PYTHON_MIRROR" ]] ; then python3 -m pip config set global.index-url https://$PYTHON_MIRROR/simple ; fi && \
 python3 -m pip install --user --upgrade pip && \
 python3 -m pip install --user flask flask-cors gunicorn && \
 apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy the backend api
COPY latexdiff_web.py wsgi.py /root/
COPY static /root/static/

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["/usr/bin/python3 -m gunicorn wsgi:app -b 0.0.0.0:8000 --timeout 3600 --workers $(( $(nproc) * 2 ))"]
