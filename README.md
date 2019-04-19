# Ride Surfer

This is the main repo for Ride Surfer team. Fall 2018 Senior Capstone Project 
with Jim de St Germain.

Team members: Ethan Ransom, Osama Kergaye, Rachel Brough, and Thuy Nguyen. 

## Overview

The project consists of three main components, the backend webserver,
the frontend app, and the admin website.

If you have an Android device, the latest production version of
the app can be installed here:

[https://play.google.com/store/apps/details?id=com.ridesurfer.ridesurfer](https://play.google.com/store/apps/details?id=com.ridesurfer.ridesurfer)

## Setup

Make sure you have node.js installed.

## Running the frontend

To run a development version of our app you'll need to install the
Expo app on your Android or iOS device.

You can run a fairly up to date "beta" version by following this link:
[https://expo.io/@ethanran/RideSurfer](https://expo.io/@ethanran/RideSurfer)

(Note that iOS devices can only load expo apps published by the owner
of the phone due to Apple's restrictions.)

From the `frontend/` directory, run `npm install` to install our third
party libraries. Install expo globally with `npm install -g expo`. Run
the development server with `expo start`. A QR code should appear, 
either in the terminal or in a popup webpage. Scanning that will direct
your phone to the development server and begin the building process.

By default, the development version of the app still communicates with 
the production backend. To change this, modify `frontend/network/Backend.ts`
to use the URL/IP and port of your local backend.

## Running the backend

You'll need the postgres database installed.

Install the sequelize cli with `npm install -g sequelize-cli`. Now, create
the database with `sequelize db:create`. Update all the migrations with 
`sequelize db:migrate`. You will need to remigrate after adding any migrations,
or after pulling code that may have added migrations.

From the current directory, run `npm install` to install our third party
libraries. Run the server with `node bin/www`.

## Running the Admin Dashboard

Switch to the `admin/` directory. Run `npm install` to install the third
party libraries. Run the development server with `npm start`. 
