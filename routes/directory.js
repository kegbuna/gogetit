import FeedMe from 'feedme';
import request from 'request';
import Logger from 'log4js';

import config from '../config.json';
const logger = Logger.getLogger('Directory Get');

logger.setLevel(config.logLevel);

const parser = new FeedMe(true);

import directory from '../rss_links/directory.json';
import * as directories from '../rss_links/export';


export function Get(req, res, next) {
  const department = req.params.department;

  const feedIndex = req.params.feedIndex;

  logger.debug(`Params: ${JSON.stringify(req.params)}` );
  const work = new Promise((resolve, reject) => {
    if (!department) {
      resolve(directory);
    } else if (isNaN(feedIndex)) {
      resolve(directories[department]);
    } else {
      const url = directories[department][feedIndex].link;

      logger.debug(`Retrieving from ${url}.`);
      request(url)
        .pipe(parser)
        .on('error', err => {
          logger.error(`Oh no while parsing: ${JSON.stringify(err)}`);
          reject(err);
        });

      parser.on('end', data => {
        const results = parser.done();
        resolve(results);
      })
    }
  });

  work.then(result => {
    res.send(result);
  }).catch(err => {
    res.send(500, err);
  })
}