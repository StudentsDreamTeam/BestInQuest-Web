FROM node:20-alpine
WORKDIR /app/front
EXPOSE 5173
COPY ./ ./
RUN npm install
CMD ["npm", "run", "dev"]
