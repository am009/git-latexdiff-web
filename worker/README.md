# latexdiff web docker runner

To debug the worker:

```
docker run -v /sn640/git-latexdiff-web/tests/example:/work -v /sn640/git-latexdiff-web/worker/preamble_gen.py:/root/preamble_gen.py -v /sn640/git-latexdiff-web/worker/run.sh:/root/run.sh --network none --cpus 2 --memory 6g --security-opt=no-new-privileges -it --rm --entrypoint bash am009/latexdiff-web-worker
```

Then run the following command to run latexdiff:

```
bash /root/run.sh
```
