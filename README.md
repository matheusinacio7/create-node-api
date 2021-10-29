# Create Node API
#### Simple modular framework/template architecture for building APIs with Node

## What's this?

This is an "ejected framework" as in: you use it once to set up the project, and it doesn't get in your way anymore.

It installs an opinionated architecture with many things pre-installed and configured.

In the future, it will allow you to optionally configure different layers, since it uses a layered architecture.

## How to use it?

Run
```bash
npm init @heyset/node-api NAME_OF_THE_FOLDER
```

Where NAME_OF_THE_FOLDER is where you want to install the new project. It can be `.`.

Currently, this only works with:
 - yarn
 - Linux (maybe Mac?)

## What's included?

  - Model-Controller-Router architecture;
  - TypeScript;
  - Express server;
  - REST routers;
  - Custom error classes;
  - Error handling and endpoint fallback middlewares;
  - Validation with ajv.

### What are those layers?

#### Routers and middlewares
Deal with the HTTP protocol. That means extracting data from requests and converting processed info into HTTP responses.

Ideally, the other layers don't even know they're in an HTTP environment.

Routers are also responsible for determining the endpoints.

They usually talk to the controllers.

Current implementation:
- REST

#### Controllers
Handle input, calling upon services and other functions.

Talk to Models to deal with data.

Return processed data.

#### Models
Receive sanitized input, talks to the data persistence system (usually a DB), retrieving and manipulating data from the storage.

Returns raw output.

Current implementation:
- MongoDB

## How can I help?

Thanks for the interest!

You can check out the open issues, create a fork and open issues you deem necessary :D

Soon, we will probably have a contributing guide.

## Legal

This project is under MIT's open-source license, which is very permissive.

It means you can use this code for non-commercial and commercial projects, but any copy or substantial copy of it must also be under the same terms.

It also means the software is provided "as is", with no warranty of any kind.

For more info, read the LICENSE file.
