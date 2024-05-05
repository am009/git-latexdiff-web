# 
FROM am009/latex

# docker build . --tag am009/latexdiff-web-worker

# install jq
RUN apt-get update && \
 DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends jq && \
 apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
 mkdir /work

# Copy the script
COPY run.sh preamble_gen.py /root/

# run the script by default with no argument
WORKDIR /work
ENTRYPOINT ["/bin/bash", "/root/run.sh"]
CMD []
