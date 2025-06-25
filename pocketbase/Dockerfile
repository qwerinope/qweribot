FROM alpine:latest

ARG PB_VERSION=0.28.4
ARG PB_ZIPNAME=pocketbase_${PB_VERSION}_linux_amd64.zip

RUN apk add --no-cache \
  unzip \
  ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${PB_ZIPNAME} /tmp/${PB_ZIPNAME}
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/checksums.txt /tmp/checksums.txt
WORKDIR /tmp
RUN grep ${PB_ZIPNAME} checksums.txt | sha256sum -c
RUN unzip /tmp/${PB_ZIPNAME} -d /pb/

COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8090
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
