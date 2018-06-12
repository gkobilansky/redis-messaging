# Redis Messaging - a Serverless example
A simple message queue using node, Redis and the Serverless framework

## Features

This is a sample setup of a messaging service (instead of using Amazon SMS for example).

* Initialize new queue in your Redis server
* List available queues
* Send and receive messages
* Received messages are hidden in queue for 30 seconds (configurable via init)
* Received messages can be deleted using message ID

**Please note:** although you can initialize multiple queues, current implementation for send/receive/delete works with hardcoded queue name of `myqueue`.


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


_Parameters:_

* `qname` (String): The Queue name. Maximum 160 characters; alphanumeric characters, hyphens (-), and underscores (\_) are allowed.
* `vt` (Number): The length of time, in seconds, that a message received from a queue will be invisible to other receiving components when they ask to receive messages. Allowed values: 0-9999999 (around 115 days)

Ex:
`{ 'name': 'myqueue', 'vt': 30 }`

Creates a new queue, returns confirmation. `vt` sets how long a message is invisible for in seconds.

**Please note**: current code for below endpoints hardcodes queue name as 'myqueue'. Expect this to be updated in future versions.

### Get list of queues

**GET /queues**


_Parameters:_ none

Returns a list of all queues.

### Send a message to the queue

**POST /messages/send**


_Parameters:_ body - required

Ex:
`{ 'my message' }`

Adds message to queue, returns message ID.

### Grab a message from the queue

**GET /messages/receive**


_Parameters:_ none

Returns top (visible) message from the queue. Makes message invisible for 30 seconds.

**POST /messages/delete**


_Parameters:_ body = messageID - required

Ex:
`{ 'f08zycfmxp0M0vQWGweN5hI4mwUxgncc' }`

### Get Developer Info

**GET /info**

_Parameters:_ none

Returns developer info about the message queue.
