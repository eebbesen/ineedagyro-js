FROM node:8.1.2

RUN mkdir -p /usr/src/ineedagyro
RUN apt-get update && apt-get install vim -y
RUN useradd -ms /bin/bash anitagyro
RUN chown anitagyro /usr/src/ineedagyro
USER anitagyro
WORKDIR /usr/src/ineedagyro
RUN npm install
CMD ["npm", "start"]


