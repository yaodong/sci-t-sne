# t-SNE

## How to setup a server

First, install [docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#os-requirements).

## How to build

Build the static file server

```shell
docker build -t sci-t-sne-web .
```

Build the API server

```shell
cd api/
docker build . -t sci-t-sne-api
```


