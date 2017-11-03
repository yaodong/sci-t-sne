FROM ubuntu:17.04

RUN apt-get -qq update \
    && apt-get install -qq -y python3 python3-pip git build-essential software-properties-common \
    libssl-dev libcurl4-openssl-dev libssh2-1-dev apt-transport-https libgmp3-dev libmpfr-dev

ENV IMG_VERSION 1

ADD install-r.sh .
RUN bash install-r.sh

# TODO download tar.gz instead of git clone
RUN git clone https://github.com/Ripser/ripser.git /root/ripser
WORKDIR /root/ripser
RUN make && cp ripser /usr/bin/

ADD . /srv/
WORKDIR /srv


RUN Rscript install.r
RUN pip3 install -r requirements.txt

CMD ["python3", "api.py"]
