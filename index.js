import restify from 'restify';
import config from './config.json';
import directoryGet from './routes/directory';

const server = restify.createServer();
server.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

server.get('/govreader/directory', directoryGet);
server.get('/govreader/directory/:department', directoryGet);
server.get('/govreader/directory/:department/:feedIndex', directoryGet);

server.listen(config.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});