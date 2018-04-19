'use strict';
const RSMQPromise = require('rsmq-promise');
import { success, failure } from './libs/response-lib';

const rsmqOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ns: 'rsmq'
};

export async function init(event, context, callback) {
  //Instruct the lambda to exit immediately
  //and not wait for node event loop to be empty.
  //https://stackoverflow.com/questions/43532359/serverless-function-always-timeout-on-lambda/43533732#43533732
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise(rsmqOptions);
  const queueInfo = JSON.parse(event.body);
  const queueName = queueInfo.name;
  const vt = queueInfo.vt;

  function createQueue() {
    return new Promise(function(resolve, reject) {
      rsmq
        .createQueue({
          qname: queueName,
          vt: vt
        })
        .then(done => {
          resolve('queue created');
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  try {
    const result = await createQueue();
    if (result) {
      callback(null, success(result));
    } else {
      callback(null, failure({ status: false, error: 'queue not created.' }));
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function listQueues(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise(rsmqOptions);

  function getQueues() {
    return new Promise(function(resolve, reject) {
      rsmq
        .listQueues()
        .then(queues => {
          resolve(queues);
        })
        .catch(err => {
          console.log(err);
          //TODO work through lambda error callback
          // callback(err);
        });
    });
  }

  try {
    const result = await getQueues();
    if (result) {
      callback(null, success(result));
    } else {
      callback(null, failure({ status: false, error: 'queues not found.' }));
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function sendMessage(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise(rsmqOptions);

  const sentMessage = JSON.stringify(event.body);
  function sendMessageToQueue() {
    return new Promise(function(resolve, reject) {
      rsmq
        .sendMessage({
          qname: 'myqueue',
          message: sentMessage
        })
        .then(result => {
          console.log('Message sent. ID:', result);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          //TODO work through lambda error callback
          //callback(err);
        });
    });
  }

  try {
    const result = await sendMessageToQueue();
    console.log('message sent, heres the id:', result);

    if (result) {
      callback(null, success(result));
    } else {
      callback(
        null,
        failure({ status: false, error: 'message id not returned' })
      );
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function receiveMessage(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise(rsmqOptions);

  function receiveMessageFromQueue() {
    return new Promise(function(resolve, reject) {
      rsmq
        .receiveMessage({
          qname: 'myqueue'
        })
        .then(message => {
          console.log('Received message with ID: ', message.id);
          resolve(message);
        })
        .catch(err => {
          console.log(err);
          //TODO work through lambda error callback
          //callback(err);
        });
    });
  }

  try {
    const result = await receiveMessageFromQueue();

    if (result) {
      callback(null, success(result));
    } else {
      callback(null, failure({ status: false, error: 'message not received' }));
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function deleteMessage(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise({ rsmqOptions });
  const idOfMessageToDelete = JSON.parse(event.body);
  console.log(idOfMessageToDelete);
  function deleteMessageFromQueue() {
    return new Promise(function(resolve, reject) {
      rsmq
        .deleteMessage({
          qname: 'myqueue',
          id: idOfMessageToDelete
        })
        .then(result => {
          console.log('1 - deleted; 2 - not deleted', result);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          //TODO work through lambda error callback
          //callback(err);
        });
    });
  }

  try {
    const result = await deleteMessageFromQueue();

    if (result) {
      callback(null, success(result));
    } else {
      callback(null, failure({ status: false, error: 'message not deleted' }));
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}

export async function getInfo(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const rsmq = new RSMQPromise(rsmqOptions);

  function getQueueInfo() {
    return new Promise(function(resolve, reject) {
      rsmq
        .getQueueAttributes({
          qname: 'myqueue'
        })
        .then(result => {
          console.log('Info Received', result);
          resolve(result);
        })
        .catch(err => {
          console.log(err);
          callback(err);
        });
    });
  }

  try {
    const result = await getQueueInfo();
    console.log('heres the info about myqueue', result);

    if (result) {
      callback(null, success(result));
    }
  } catch (e) {
    //TODO work through lambda error callback
    console.log(e);
    callback(null, failure({ status: false }));
  }
}
