FROM node:22.15.0-slim

RUN mkdir -p /usr/src/ineedagyro
COPY . /usr/src/ineedagyro
RUN apt-get update && apt-get install vim -y
RUN useradd -ms /bin/bash anitagyro
RUN chown -R anitagyro /usr/src/ineedagyro
USER anitagyro
WORKDIR /usr/src/ineedagyro
RUN npm install
CMD ["npm", "start"]
