# SBHS Random Data

## What is it/Why should I use it?

It what it says on the tin. This mock server generates data that mocks the SBHS api. If you're a student at SBHS trying to develop an application that runs against the API, this should be useful for you to test your application locally.

## Disclaimers/Warnings **!!IMPORTANT!!**

1. This uses the some unauthenticated endpoints of the SBHS API, e.g. for getting the bells for the day. This means you *will* need an internet connection for this to work.
2. This doesn't mock how the api is *supposed* to behave, it mocks how it *actually* behaves, with all its weird quirks and undocumented behaviour. This library may eventually become out of date, meaning the behaviours may no longer match. If this is the case, feel free to open an issue.

## Usage

1. Install it. Run `npm install sbhs-random-data`
2. Run it. `npx sbhs-random-data`
3. Start sending requests to `localhost:8080` exactly as you would for the SBHS API.

## Extras

1. You can override the random generation to simply return the contents of a file by using the `--<insert resource name here>` flag. e.g. `npx sbhs-random-data --timetable ./timetable.json` will mean any calls to `http://localhost:8080/api/timetable/timetable.json` will return the contents of `./timetable.json`

2. You can change the port the application runs on using the `--port` flag. e.g. `npx sbhs-random-data --port 5555` will make the server appear on `http://localhost:5555`.

## FAQ

### What the heck is the `/resources` endpoint?

I use this program myself to test [Paragon](https://github.com/AndrewPerson/Lit-Paragon-Client). The `/resources` endpoint is an endpoint on the Paragon servers that Paragon uses.