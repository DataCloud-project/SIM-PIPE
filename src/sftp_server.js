// start a dockerized sftp server in host 2 using atmoz/sftp
// using dockerode-compose library

var Docker = require('dockerode');
var DockerodeCompose = require('../compose');

// var docker = new Docker();
var docker = new Docker({
    host:"127.0.0.1",
    port:2375,
    });
var compose = new DockerodeCompose(docker, './sftp_atmoz.yml', 'stfp');

//  start sftp server in host 2 using atmoz docker image
(async () => {
  await compose.pull();
  var state = await compose.up();
  console.log(state);
})();


/* var Docker = require('../dockerode_lib/docker');


// remote connection to docker daemon
var docker = new Docker({
host:"127.0.0.1",
port:2375,
});

//Volume specified in docker createcontainer function using Binds parameter
docker.createContainer({
  Image: 'atmoz/sftp',    
  Binds: '/var/lib/docker/volumes/volume_vm/_data/:/home/user1/_data',

}, (err, container) => {
      container.start({}, (err, data) => {  
        let ID = container.id  
        console.log('SFTP server started in docker container : ', ID);   
      });
});
 */
