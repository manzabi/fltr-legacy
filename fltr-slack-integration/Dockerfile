FROM openjdk:8-jdk-alpine

MAINTAINER biagio@fluttr.in

ENV SPRING_PROFILES_ACTIVE=local

# Add the service itself
ARG JAR_FILE
ADD target/${JAR_FILE} /opt/fltr/${JAR_FILE}

ENV SERVICE_NAME ${JAR_FILE}

ENTRYPOINT java -Djava.security.egd=file:/dev/./urandom -jar /opt/fltr/$SERVICE_NAME

EXPOSE 8090
