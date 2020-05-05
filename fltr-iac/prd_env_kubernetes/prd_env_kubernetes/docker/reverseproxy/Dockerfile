FROM nginx:stable

USER root

RUN mkdir -p /home/bizaround/certificates/2018/
WORKDIR /home/bizaround/certificates/2018/
COPY input_files/certificates/* ./

COPY input_files/nginx.conf /etc/nginx/nginx.conf
