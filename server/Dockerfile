FROM keymetrics/pm2:18-alpine

COPY dist dist/
COPY package.json .
COPY pm2.json .

RUN yarn install --production

CMD [ "pm2-runtime", "start", "pm2.json" ]