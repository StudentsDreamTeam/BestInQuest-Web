FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app/front
EXPOSE 5173
COPY ./ ./
RUN npm install --legacy-peer-deps
CMD ["npm", "run", "dev"]
