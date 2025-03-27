FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install lottie-react

COPY . .

# Ensure proper permissions for node_modules
RUN chmod -R 777 /app/node_modules

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
