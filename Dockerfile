FROM  node:latest
RUN  mkdir /devjams
WORKDIR   /devjams
COPY   .  .
RUN   npm  install
EXPOSE  3005
CMD  ["npm","start"]