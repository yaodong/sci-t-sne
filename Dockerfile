FROM ubuntu:16.04

RUN apt-get -qq update \
    && apt-get install -qq -y python3

COPY . /srv

WORKDIR /srv/public

CMD ["python3", "-m", "http.server"]
