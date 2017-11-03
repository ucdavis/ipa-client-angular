FROM nginx:1.12
MAINTAINER Christopher Thielen

COPY dist /usr/share/nginx/html
