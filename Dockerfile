FROM node:19.4.0-alpine3.16
WORKDIR /app
COPY package.json .
RUN npm install

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm install --only=production; fi


COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "dev"]