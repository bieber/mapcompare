FROM node:10-alpine AS builder
ARG API_KEY
WORKDIR /app
COPY . /app
RUN sed \
	"s/YOUR API KEY HERE/$API_KEY/" \
	src/config/config.js.sample \
	> src/config/config.js
RUN npm install
ENV NODE_ENV production
RUN npm run build

FROM nginx:1.15.6-alpine
LABEL maintainer="docker@biebersprojects.com"
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
