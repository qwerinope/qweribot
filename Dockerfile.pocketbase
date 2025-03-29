FROM alpine:latest

ARG PB_VERSION=0.26.5
ARG PB_ZIPNAME=pocketbase_${PB_VERSION}_linux_amd64.zip

RUN apk add --no-cache \
	unzip \
	ca-certificates

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${PB_ZIPNAME} /tmp/${PB_ZIPNAME}
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/checksums.txt /tmp/checksums.txt
WORKDIR /tmp
RUN grep ${PB_ZIPNAME} checksums.txt | sha256sum -c
RUN unzip /tmp/${PB_ZIPNAME} -d /pb/

# uncomment to copy the local pb_migrations dir into the image
# COPY ./pb_migrations /pb/pb_migrations

# uncomment to copy the local pb_hooks dir into the image
# COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8090

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
