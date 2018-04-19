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

**POST /init**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/init

Parameters: body - required
Ex:
`{ 'name': 'myqueue', 'vt': 30 }`

Creates a new queue.

**Please note**: current code for below endpoints hardcodes queue name as 'myqueue'. Expect this to be updated in future versions.

**GET /queues**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/queues

Parameters: none

Lists all queues.

**POST /messages/send**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/send
Parameters: body - required
Ex:
`{ 'my message' }`

Adds message to queue, returns message ID.

**GET /messages/receive**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/receive

Parameters: none

Receive top (visible) message from the queue.

**POST /messages/delete**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/messages/delete

Parameters: body -> messageID - required
Ex:
`{ 'f08zycfmxp0M0vQWGweN5hI4mwUxgncc' }`

**GET /info**
demo: https://rnyin3rr0e.execute-api.us-east-1.amazonaws.com/dev/info

Parameters: none

Get developer info about the message queue.
