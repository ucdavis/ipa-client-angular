FROM node:10 AS builder
WORKDIR /usr/src
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine

LABEL maintainer="UC Davis LS IT https://lsit.ucdavis.edu"

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
