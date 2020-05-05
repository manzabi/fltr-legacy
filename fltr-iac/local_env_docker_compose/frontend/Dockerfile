
# talent build environment
FROM node:8.12.0 as builder-talent
RUN mkdir /usr/src/talent
WORKDIR /usr/src/talent
ENV PATH /usr/src/talent/node_modules/.bin:$PATH
COPY input_files/src/candidateweb/package.json /usr/src/talent/package.json
RUN npm install --silent
COPY input_files/src/candidateweb /usr/src/talent
RUN npm run build-stg

# website build environment
FROM node:6.10.2 as builder-website
RUN mkdir /usr/src/website
WORKDIR /usr/src/website
ENV PATH /usr/src/website/node_modules/.bin:$PATH
COPY input_files/src/reactweb/website/package.json /usr/src/website/package.json
RUN npm install --silent
COPY input_files/src/reactweb/website /usr/src/website
RUN npm run dist-stg

# console build environment
FROM node:6.10.2 as builder-console
RUN mkdir /usr/src/console
WORKDIR /usr/src/console
ENV PATH /usr/src/console/node_modules/.bin:$PATH
COPY input_files/src/reactweb/demo/package.json /usr/src/console/package.json
RUN npm install --silent
COPY input_files/src/reactweb/demo /usr/src/console
RUN npm run dist-stg

# staging environment
FROM nginx:1.13.9-alpine
COPY --from=builder-website /usr/src/website/build /usr/share/nginx/website
COPY --from=builder-talent /usr/src/talent/build /usr/share/nginx/talent
COPY --from=builder-console /usr/src/console/dist /usr/share/nginx/console
# RUN rm /etc/nginx/conf.d/default.conf
COPY input_files/config/conf/conf.d/* /etc/nginx/conf.d/
COPY input_files/config/conf/nginx.conf /etc/nginx/
# COPY ./config/conf/conf.d/default.conf /etc/nginx/conf.d/
# RUN cat /etc/nginx/conf.d/default.conf

EXPOSE 8081
EXPOSE 8082
EXPOSE 8083
CMD ["nginx", "-g", "daemon off;"]