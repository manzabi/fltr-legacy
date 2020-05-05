FROM nginx:stable

USER root

RUN mkdir -p /home/fritzzz/webnginx
RUN mkdir -p /home/fritzzz/webnginx/image
RUN mkdir -p /home/fritzzz/webnginx/file
WORKDIR /home/fritzzz/webnginx
COPY --chown=nginx:nginx input_files/image/ ./image/


COPY input_files/nginx.conf /etc/nginx/nginx.conf
#COPY input_files/fluttr_rp.conf /etc/nginx/conf.d/