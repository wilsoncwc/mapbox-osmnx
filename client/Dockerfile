FROM node:lts

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./

RUN npm install

EXPOSE 3000
CMD ["npm", "run", "dev"]