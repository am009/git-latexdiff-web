# based on a latex environment image
FROM am009/latex:latest

# docker build . --tag am009/latexdiff-web-worker

RUN git config --global init.defaultBranch main

# Copy the script
COPY run.sh preamble_gen.py /root/

# run the script by default with no argument
WORKDIR /work
ENTRYPOINT ["/bin/bash", "/root/run.sh"]
CMD []
