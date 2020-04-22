FROM node:10-alpine AS builder
WORKDIR /usr/src
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

LABEL maintainer="UC Davis LS IT https://lsit.ucdavis.edu"

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx
COPY --from=builder /usr/src/dist /usr/share/nginx/html

# Using port 9000 to match local dev
EXPOSE 9000