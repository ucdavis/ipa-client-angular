FROM httpd:2.4
MAINTAINER Christopher Thielen

COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./dist/ /usr/local/apache2/htdocs/

EXPOSE 80
EXPOSE 443
