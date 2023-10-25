# Setup

To init the project, `yarn install`

Create a `.env` file in the root dir with contents matching `example.env`

To run the server, `yarn dev`

Other commands can be found in `package.json`

# Deployments

For admins who want to deploy to their namespace, you must set up a `.env.preview` file for important environment vars for your preview branch including: VERCEL_ACCESS_TOKEN (required), BUNGIE_API_KEY (required), DATABASE_URL (required), bungie API OAuth credentials (if auth is needed), custom AWS credentials (if needed), other oauth provider details (twitter, discord, twitch) if preffered. You will need to get the PLANETSCALE_TOKEN (access token), and then run `yarn deploy [name]`. DM newo\_ on discord for the access token.

# Tech Stack

-   Framework: Next.js (pages) + React
-   Component/CSS Libraries: None, Vanilla CS
-   Other libraries: React Query, Bungie.net Core, dexie db, framer motion
-   Host: Vercel
-   CDN: AWS S3, Cloudflare
-   ORM: Prisma
-   Database Provider: Planetscale

# Developer Guidelines

The project is organized into major parts as follows. All PRs will fail if prettier is not run before submitting (I recommend the VScode extension). They will also fail if the linter fails, so run `yarn lint` before pushing/creating your PR.

To be honest, there is not a lot of documentation. My bad (owen), but if you have any questions I can answer and provide some docs where needed.

## Components

All React components should be placed here. Divide into sub folders as needed, there aren't any specific rules, but if you think components are related, go for it.

## Data

Hash mappings, ids, and other static data for the app. A lot of this is being moved over to the API, but for now we use this.

## Hooks

Advanced logic that can either be re-used or is too much to put into a single component. All hook files should start with "use" and export a single function.

## Images

Files that deal with the image content on the site

## Models

Complex models can be placed here. Models are useful for handling logic outside of a hook or a component.

## Pages

Every file in the directory is a Next.js page (or API route)

## Server

This file deals with code that will be run server side on a serverless function invocation. Do not import any functions from here into client-facing code.

## Services

External API calls to Bungie and the public RaidHub API belong here, along with any other external calls. Generally, this handles the networking and react query will handle the caching/processing.

## Styles

CSS files for pages or components. Some styles can be thrown into the components files too, no solid roles here either.

## Types

Global TypeScript types that may not belong to a specific file. Generally only use this if you know for certain you will be re-using a type often.
