# This documentation is currently work in progress..


# Overview

The purpose of this software is to...

- Download files from server
- Save the files to selected folder

# Running project

After cloning this repo, remember to run

`npm install`

to install dependencies.

To run project locally, execute the following command

`npm run start`

This will build the React application and launch it inside electron.


# Building locally

To build a executable file locally, following command can be used

`npx electron-packager <sourcedir> <appname> --platform=<platform>`

platform options:
- --platform all    = build all platforms (windows, linux, osx)
- --platform win32  = windows
- --platform linux  = linux
- --darwin          = mac os x

The build folder can be found from the root directory of the project once the build is finished.
Note: In order to build mac version, a mac computer is required.

# Pipeline and Build

This project contain a pipeline, which will handle building and packaging of the window executable.
The pipeline will run every time code changes are pushed into the repository and as a result a new version of the executable application is created.

The pipeline can be found under the following link:

https://github.com/menu-hanke/smk-browser/actions

# Downloadable files

The executable version can be downloaded from any pipeline that has passed.
In order to get the latest version, select the latest build that has passed.
The downloadable content can be found at the bottom of the page in 'Artifacts' section of the page.
