#!/usr/bin/env sh

docker run -it --rm -d -p 8080:80 --name dev-webserver -v ./webfiles:/usr/share/nginx/html nginx
