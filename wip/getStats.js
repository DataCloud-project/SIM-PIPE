var Docker = require('dockerode');

var fs = require('fs');
//var _ = require('lodash');
// Load the core build.
var _ = require('lodash/core');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });

var ID = process.argv[2]; //need console input container ID 

var container = docker.getContainer(ID);

/* saves the current values of resource usage to a file
   subset variable can be modified to the requires statistics
*/
container.stats({ stream: true }, function (err, stream) {
	   if (err) { console.log('null'); }
	   var filename = './stats_'+ ID +'.txt'	//filename with container id
	   var subset = _.pick(stream, ['cpu_stats', 'memory_stats', 'name', 'id']); //store only required details
	   /*fs.writeFile(filename, JSON.stringify(subset, null, ' '), function(err, result) {
		 if(err) console.log('error', err);
	   });*/
	   console.log(stream);
   	   console.log('Saved to file', filename);
});