# WonderQ

A simple message queue using node, Redis and the Serverless framework

## Features

* Initialize new queue in your Redis server
* List available queues
* Send and receive messages
* Received messages are hidden in queue for 30 seconds (configurable via init)
* Received messages can be deleted using message ID

**Please note:** although you can initialize multiple queues, current implementation for send/receive/delete works with hardcoded queue name of `myqueue`.

## Demo

You can send messages to WonderQ and see the demo queue stats at our [front end](http://quick-start-dev-serverlessdeploymentbucket-ntikgcvze067.s3-website-us-east-1.amazonaws.com/index.html).

## Setup

1. [Install serverless globally](https://serverless.com/framework/docs/providers/aws/guide/installation/) and add (for example) aws credentials.

2. Clone the repo

3. To use your own Redis server, update environment variables and the VPC info in serveless.yml

4. Run `npm install`

5. Run `sls deploy`. You should get the full endpoints in the output.

6. Client/dist contains index.html. To setup a client bucket, update bucketName in serverless.yml

7. Change `axios.defaults.baseURL` in index.html to your endpoint's baseURL.

8. Run `sls client deploy`

## Endpoints

### Create a queue

**POST /init**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/init

Parameters: body - required

Ex:
`{ 'name': 'myqueue', 'vt': 30 }`

Creates a new queue, returns confirmation.

**Please note**: current code for below endpoints hardcodes queue name as 'myqueue'. Expect this to be updated in future versions.

### Get list of queues

**GET /queues**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/queues

_Parameters:_ none

Returns a list of all queues.

### Send a message to the queue

**POST /messages/send**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/send

_Parameters:_ body - required

Ex:
`{ 'my message' }`

Adds message to queue, returns message ID.

### Grab a message from the queue

**GET /messages/receive**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/receive

_Parameters:_ none

Returns top (visible) message from the queue. Makes message invisible for 30 seconds.

**POST /messages/delete**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/delete

_Parameters:_ body = messageID - required

Ex:
`{ 'f08zycfmxp0M0vQWGweN5hI4mwUxgncc' }`

### Get Developer Info

**GET /info**

demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/info

_Parameters:_ none

Returns developer info about the message queue.
