FROM node:8

EXPOSE 9000

LABEL maintainer="UC Davis DSS IT http://it.dss.ucdavis.edu"

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY .eslintrc.json ./
RUN yarn install

COPY app/ ./app

RUN yarn lint

#CMD java -Djava.security.egd=file:/dev/./urandom -jar /app.jar
