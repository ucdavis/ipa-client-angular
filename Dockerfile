FROM httpd:2.4
MAINTAINER Christopher Thielen
#VOLUME /tmp
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./dist/ /usr/local/apache2/htdocs/

COPY ./ipa_ucdavis_edu.crt /usr/local/apache2/conf/server.crt
COPY ./ipa_ucdavis_edu.key /usr/local/apache2/conf/server.key

EXPOSE 443

ENV SERVER_ADMIN_EMAIL root@localhost
ENV SERVER_NAME ipa.ucdavis.edu
