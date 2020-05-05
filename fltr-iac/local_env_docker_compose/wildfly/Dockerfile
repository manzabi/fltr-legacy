
FROM jboss/wildfly:8.2.1.Final

LABEL com.fluttr.version="0.0.1-snapshot"
LABEL author="Biagio Manzari"
LABEL email="biagio@fluttr.in"
LABEL vendor1="Fluttr"
LABEL com.fluttr.release-date="2018-12-21"

# Set Postgresql env variables
ENV DB_HOST postgres
ENV DB_PORT 5432
ENV DB_NAME bizaround
ENV DB_USER bizaround
ENV DB_PASS bizaround

ENV DS_NAME postgresDS
ENV JNDI_NAME java:jboss/datasources/postgresDS

COPY input_files/wildfly/modules/ $JBOSS_HOME/modules/

# Fix configuration for Java 8
ADD input_files/wildfly/standalone.conf $JBOSS_HOME/bin/

ADD input_files/wildfly/configuration/standalone.xml $JBOSS_HOME/standalone/configuration

USER root

RUN mkdir -p /home/fritzzz/projects/bizaround/bizaround/extras/certificates/jwt/
WORKDIR /home/fritzzz/projects/bizaround/bizaround/extras/certificates/jwt/
COPY --chown=jboss:jboss input_files/certificates/* ./

WORKDIR /tmp
COPY input_files/wildfly-command.sh ./
#COPY input_files/module-install.cli ./
RUN sed -i -e 's/\r$//' ./wildfly-command.sh
RUN chmod +x ./wildfly-command.sh
RUN ./wildfly-command.sh 

# Create Wildfly admin user
RUN $JBOSS_HOME/bin/add-user.sh admin admin --silent

# Set the default command to run on boot
# This will boot WildFly in the standalone mode and bind to all interface
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]