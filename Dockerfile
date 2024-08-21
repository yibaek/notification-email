###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:20-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node package.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN yarn install

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################
FROM node:20-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/package.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Bundle app source
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN yarn build

# Use the node user from the image (instead of the root user)
USER node

###################
# PRODUCTION
###################
FROM node:20-alpine AS production

# Set NODE_ENV environment variable
ENV NODE_ENV development

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/public ./public
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env.development .
#COPY --chown=node:node --from=build /usr/src/app/.env.test .
#COPY --chown=node:node --from=build /usr/src/app/.env.production .

# Start the server using the production build
CMD [ "yarn", "start:prod" ]
