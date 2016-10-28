FROM httpd:2.4
MAINTAINER Christopher Thielen
#VOLUME /tmp
COPY ./dist/ /usr/local/apache2/htdocs/
#ADD gs-spring-boot-docker-0.1.0.jar app.jar
#RUN sh -c 'touch /app.jar'
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
