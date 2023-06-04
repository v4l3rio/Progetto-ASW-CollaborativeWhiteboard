# Collaborative Whiteboard

The purpose of the project is to create a collaborative whiteboard using real time protocols

## Getting Started

### Dependencies

- Docker
- Vue-cli

## Get Started
The first thing to do as soon as you download the project is to generate both images, one for the frontend and one for the backend.
To do this, simply run the commands:
```
make update-api
make update-frontend
```
once done it will be possible to launch the application via the command:
```
make run
```

### Instructions for the various commands in the makefile
There is a Makefile that allows you to launch the several commands

```
make run
```
Starts the entire environment

```
make stop
```
Stops the entire environment

```
make update-api
```
Regenerates the api image from the code

```
make update-frontend
```
Regenerates the frontend image from the code

## Authors

- Valerio Di Zio
- Francesco Magnani
- Thomas Capelli
