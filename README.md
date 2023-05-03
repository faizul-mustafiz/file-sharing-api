# file-sharing-api

This a file sharing rest api where user can upload, download and delete files to both local bucket and cloud bucket using `PROVIDER` env variable and `CONFIG` file absolute path. There is also an inside storage cleanup job which is configurable. Also this application has feature to limit daily upload and download limit to bucket which is also configurable

## Quick Start

To get started with the project quickly do these steps

Clone the repo:

```
git clone https://github.com/faizul-mustafiz/file-sharing-api.git
```

Install the dependencies:

```
npm install
# OR
npm ci
```

Set the environment variables:
To run the project set up the environment variables. An `env.example` file is present listing the necessary variables for the project.
Make new file name `.env` or rename `.env.example` to `.env` at the root of the project and make necessary changes. a description is also provided.

Two key environment variables are very important

- **PROVIDER**: this variable is needed to determine storage provider local/cloud
- **CONFIG**: this the config.json absolute path in which there will be the google cloud storage key.json and bucket related information will reside.

Run the project locally:

```
npm start
```

## Project Structure

```
|--src\v1
    |--configs\        # config of plugins and environments
    |--controllers\    # route controller functions
    |--enums\          # required enums
    |--environments\   # different types of environment configuration
    |--errors\         # Error handling files fro different types of error
    |--helpers\        # route controller helpers functions
    |--logger\         # base logger and file logger config files
    |--middlewares\    # express middlewares related to auth and validation
    |--plugins\        # plugins for project like redis and mongodb
    |--responses\      # success response object builder
    |--providers\      # common storage provider for both local and cloud
    |--routes\         # route definitions
    |--test\           # unit test definition functions
    |--utility\        # utility functions
    |--app.js          # express application init and injections
|--.env.example        # env file example
|--.gitignore          # git ignore list
|--.mocharc.json       # mocha config
|--.prettierignore     # prettier ignore list
|--.prettierrc         # prettier config
|--index.js            # application entry point, server, shutdown
|--package-lock.json
|--package.json
|--README.md
```

## Environment Variables

The environment variables example can be found in `.env.example` and edit these fields in `.env` file

```
#app environment variables
API_PROTOCOL="http"
API_HOST="0.0.0.0"
API_PORT=3030
BASE_API_ROUTE="/api/v1"

# redis environment variables
# this url is for redis Labs
REDIS_URL="your-redis-db-connection-string"

# redis test environment variables
REDIS_URL_TEST="your-redis-test-db-connection-string"

# file storages related variables
FORM_DATA_KEY="from-data-key-name"
# maximum file size in bytes
MAX_FILE_SIZE=26214400
PROVIDER="your-file-storage-provider-name" # google/local
CONFIG="your-config-json-absolute-path"

# rate limiter related variables all the ttl variables in hours
MAX_ALLOWED_REQUESTS=100 # number of file per day
WINDOW_TTL=24 # one day in hours
WINDOW_LOG_INTERVAL_TTL=1 # log interval ttl

# file cleanup related variables. Time is in days, you can also configure this for minutes, hours, days and months
CLEANUP_JOB_INTERVAL=1
```

## API Endpoints

### Users

- `[GET]` upload-file: `http://{host}:{port}/api/v1/files`
- `[GET]` download-file: `http://{host}:{port}/api/v1/files/{publicKey}`
- `[DELETE]` delete-file: `http://{host}:{port}/api/v1/files/{privateKey}`

## Testing

For testing Mocha and Chai.js is used. you can see the test command in `package.json` file.

**Note:** You need to add a redis test db url to `REDIS_TEST_URL` key in `.env` file, as after test case completion redis db is flushed. So if you don't this then main redis will be flushed.

### Run this command to test manually

```
npm test
```

## Conclusion

This application is a basic implementation of file upload download and delete. There can be many further improvements like CI using github-action and also look into `containerization` using `Docker` and `orchestration` using `Kubernetes`.
