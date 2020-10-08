FROM node:14-alpine

RUN apk add wget \
    && wget https://releases.hashicorp.com/consul-template/0.25.0/consul-template_0.25.0_linux_amd64.tgz \
    && tar -xzvf consul-template_0.25.0_linux_amd64.tgz \
    && mv consul-template /usr/local/bin/consul-template \
    && chmod +x /usr/local/bin/consul-template \
    && consul-template -version

WORKDIR /opt/app

ADD . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
