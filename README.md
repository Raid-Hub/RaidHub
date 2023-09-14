# Setup

To init the project, `yarn install`

Create a `.env` file in the root dir with contents matching `example.env`

To run the server, `yarn dev`

# Deployments

To deploy to your name space, you will need to install the vercel cli, login, and run `yarn deploy [name]`. DM Newo on discord for the access token.

You must set up a `.env.preview` file for important environment vars for your preview branch including: VERCEL_ACCESS_TOKEN (required), BUNGIE_API_KEY (required), DATABASE_URL (required), bungie API OAuth credentials (if auth is needed), custom AWS credentials (if needed), other oauth provider details (twitter, discord, twitch) if preffered.

# Tech Stack

This site uses React with Next.js and Vanilla CSS. The Bungie.net Core library is used to make requests to the Bungie API

# Developer Guidelines

The project is organized into major parts as follows

## Components

All React components should be placed here

## Data

Hash mappings, ids, and other static data for the app

## Hooks

Advanced logic that can either be re-used or is too much to put into a single component. All hook files should start with "use" and export a single function.

## Models

Complex models can be placed here. Models are useful for handling logic outside of a hook or a component.

## Pages

Every file in the directory is a Next.js page

## Server

This file deals with code that will be run server side on a serverless function invocation

## Services

External API calls to Bungie and the public RaidHub API belong here, along with any other external calls.

## Styles

CSS files for pages or components.

## Types

Global TypeScript types that may not belong to a specific file.
