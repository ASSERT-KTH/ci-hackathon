FROM node:12.10.0-alpine AS builder
WORKDIR /app
COPY . /app
RUN yarn install && yarn run build

FROM node:12.10.0-alpine
RUN yarn global add serve
COPY --from=builder /app/dist /app
EXPOSE 8080
CMD ["serve", "-p", "8080", "-s", "/app"]