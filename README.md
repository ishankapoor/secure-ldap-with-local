run front end nginx

docker run --name dev-ssl-nginx --link handoff:handoff -v /home/rts/ssl/:/etc/nginx/ssl -v /home/rts/ssl/nginx-configuration:/etc/nginx/conf.d/default.conf -v /home/rts/ssl:/usr/share/nginx/html -p 443:443 -p 80:80 -d nginx

run docker image for nodejs app

docker run --name handoff -it --link handoff-mongo:mongo node:latest bash

run mongo-db docker container

docker run --name handoff-mongo -d mongo 

start

DEBUG=holidaysignup:* npm start
