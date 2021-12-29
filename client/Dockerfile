#Creates a layer from node:alpine image.
FROM node:lts-alpine

WORKDIR /usr/src/app
ENV PORT 3000

#Copy new files or directories into the filesystem of the container
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile
COPY . /usr/src/app
RUN yarn build

EXPOSE 3000
ENTRYPOINT ["yarn", "start"]
