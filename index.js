const serverless = require('serverless-http');
const RedisSMQ = require('rsmq');
const express = require('express');
const app = express();

const rsmq = new RedisSMQ({
  host: 'wonderq.bewcvz.ng.0001.use1.cache.amazonaws.com',
  port: 6379,
  ns: 'rsmq'
});

rsmq.createQueue({ qname: 'myqueue' }, function(err, resp) {
  if (resp === 1) {
    console.log('queue created');
  }
});

app.get('/', async (req, res, next) => {
  try {
    let results = {};

    results.queues = await rsmq.listQueues();
    results.msgs = await rsmq.getQueueAttributes({ qname: 'myqueue' });
    console.log(res, results);
    res.json(results);
  } catch (e) {
    next(e);
  }
});
// const getQueue = async () => {
//   return new Promise((resolve, reject) => {
//     rsmq.listQueues((err, queues) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(queues);
//     });
//   });

//
// const getQueueInfo = async (name = 'myqueue') => {
//   return new Promise((resolve, reject) => {
//     rsmq.getQueueAttributes({ qname: name }, (err, resp) => {
//       if (err) {
//         return reject(err);
//       } else if (resp) {
//         resolve(resp.msgs);
//       } else {
//         console.log('No queue found...');
//       }
//     });
//   });
// };

// res.send(
//   'Active queues: ' +
//     queue.join(',') +
//     'Num of messages: ' +
//     numberOfMessagesInQueue
// );

app.post('/messages', function(req, res) {
  const message = req.body.msg;
  rsmq.sendMessage({ qname: 'myqueue', message: message }, function(err, resp) {
    if (resp) {
      res.send('Message sent. ID:', resp);
    }
  });
});

module.exports.handler = serverless(app);
