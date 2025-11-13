FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN if [ -f package.json ]; then \
        npm install && \
        npm run build; \
    else \
        echo "No package.json found, creating placeholder build output" && \
        mkdir -p dist && \
        printf '<html><body><h1>Frontend build missing</h1></body></html>' > dist/index.html; \
    fi

FROM nginx:1.25-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
