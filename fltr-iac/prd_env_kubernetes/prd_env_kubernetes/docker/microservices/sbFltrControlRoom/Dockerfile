FROM openjdk:8-jdk-alpine

MAINTAINER biagio@fluttr.in

COPY files/bizAroundControlRoom-1.0-SNAPSHOT.war /opt/fltr/

ENV SPRING_PROFILES_ACTIVE=production

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/opt/fltr/bizAroundControlRoom-1.0-SNAPSHOT.war"]

EXPOSE 8090