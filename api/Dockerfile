FROM ubuntu:16.04

RUN apt-get -qq update \
    && apt-get install -qq -y build-essential cmake libboost-all-dev python3 python3-pip

# install ripser
ADD https://github.com/Ripser/ripser/archive/v1.0.1.tar.gz /root/
RUN cd /root && tar -zxf v1.0.1.tar.gz && cd ripser-1.0.1 \
    && make && cp ripser /usr/local/bin/ && cd /root \
    && rm /root/v1.0.1.tar.gz && rm -rf /root/ripser-*

# install hera
ADD ./hera-3552ce68bc76.tar.bz2 /root/
RUN cd /root/grey_narn-hera-3552ce68bc76/geom_bottleneck \
    && cmake . && make && cp example/bottleneck_dist /usr/local/bin/ \
    && cd /root/grey_narn-hera-3552ce68bc76/geom_matching/wasserstein \
    && cmake . && make && cp wasserstein_dist /usr/local/bin/ \
    && rm -rf /root/grey_narn-hera-*

RUN pip3 install -r requirements.txt

CMD ["python3", "api.py"]
