# t-SNE

This is only for private demo. Please don't deploy it to public.

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

## How to run

Run the static file server

```shell
docker run -d --name t-sne-web -p 8081:8000 sci-t-sne-web
```

Run the API server

```shell
docker run -d --name t-sne-api -p 8082:5000 sci-t-sne-api
```
