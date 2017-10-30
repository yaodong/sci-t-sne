FROM ubuntu:16.04

RUN apt-get -qq update \
    && apt-get install -qq -y python3 python3-pip git build-essential

# TODO download tar.gz instead of git clone
RUN git clone https://github.com/Ripser/ripser.git /root/ripser
WORKDIR /root/ripser
RUN make && cp ripser /usr/bin/

ADD api.py /srv/
ADD requirements.txt /srv/
WORKDIR /srv

RUN pip3 install -r requirements.txt

CMD ["python3", "api.py"]
