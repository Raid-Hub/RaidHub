# Setup

To init the project, `yarn install`

Create a `.env.local` file in the root dir with contents:

```shell
BUNGIE_API_KEY="KEY"
BUNGIE_CLIENT_ID="ID"
BUNGIE_CLIENT_SECRET="SECRET"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="generate this using 'openssl rand -base64 32' "
```

To run the server, `yarn dev`

# Tech Stack

This site uses React with Next.js and Vanilla CSS. The Bungie.net Core library is used to make requests to the Bungie API

# Developer Guidelines

The project is organized into major parts as follows

## Components

All React components should be placed here

## Hooks

Advanced logic that can either be re-used or is too much to put into a single component. All hook files should start with "use" and export a single function.

## Models

Complex models can be placed here. Models are useful for handling logic outside of a hook or a component.

## Pages

Every file in the directory is a Next.js page

## Pages/api

Each file the api directory constitutes a protected internal route. These routes should deal with RaidHub specific routes such as memberships and authentication

## Services

External API calls to Bungie and the public RaidHub API belong here, along with any other external calls.

## Styles

CSS files for pages or components.

## Types

Global TypeScript types that may not belong to a specific file.

TBD - Contact Newo#0001 on Discord
