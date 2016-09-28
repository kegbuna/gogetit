import restify from 'restify';
import request from 'request';
import FeedMe from 'feedme';
import Logger from 'log4js';
import fs from 'fs';

import { PRESS_RELEASES, SPEECHES } from './config/urls';
import { SSL_KEY, SSL_CERT } from './config/paths';

const logger = Logger.getLogger('Index');

function get(url) {
  return (req, res, next) => {
    const parser = new FeedMe(true);

    logger.debug(`Retrieving from ${url}.`);
    request(url)
      .pipe(parser)
      .on('error', err => {
        logger.error(err);
      });

    parser.on('end', data => {
      const results = parser.done();
      res.send(results);
    })
  }
}

const server = restify.createServer({
  key: fs.readFileSync(SSL_KEY),
  certificate: fs.readFileSync(SSL_CERT)
});
server.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);


server.get('/pressreleases', get(PRESS_RELEASES));
server.get('/speeches', get(SPEECHES));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});