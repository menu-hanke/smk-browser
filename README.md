# Overview

### This software:

1. Downloads files from server based on property IDs
2. Saves the downloaded JSON and XML files to a selected folder on users hard drive

### APIs used:

#### MML´s real esteta boundary services API

- Takes in property IDs and returns boundaries / polygons as GeoJSON
- The returned GeoJSON file is saved to user´s hard drive
- The returned boundaries (GeoJSON) are used in next Api request

#### SMK´s Forest Stand API

- Takes in boundaries / polygons converted into WKT format and returns forest stands as XML
- The returned XML -files is saved to user´s hard drive

# Downloading executable

- The executable version can be downloaded from any pipeline that has passed.
- In order to get the latest version, select the latest build that has passed.
- The downloadable content can be found at the bottom of the page in 'Artifacts' section of the page. (requires to be signed in to github)

The pipelines can be found under the following link

https://github.com/menu-hanke/smk-browser/actions

# Running project

Use Node 16.x

After cloning this repo, install dependencies

`npm install`

To run project locally, run

`npm run start`

This will build the React application and launch it inside electron.

# Running tests

```
npm run build:main
npm run build:renderer
npm run test
```

# Building locally 

!! OLD STUFF !!

To build an executable file locally, following command can be used

`npx electron-packager <sourcedir> <appname> --platform=<platform>`

platform options:

- --platform all = build all platforms (windows, linux, osx)
- --platform win32 = windows
- --platform linux = linux
- --platform darwin = mac os x

The build folder can be found from the root directory of the project once the build is finished.

# Pipeline and Build

- This project contain a pipeline, which will handle building and packaging of the window executable.
- The pipeline will run every time code changes are pushed into the repository and as a result a new version of the executable application is created.

The pipeline can be found under the following link:

https://github.com/menu-hanke/smk-browser/actions
