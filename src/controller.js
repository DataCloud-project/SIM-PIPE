var Docker = require('dockerode');
var fs     = require('fs');
let config = require('config')
let _ = require('lodash/core');
let async = require("async");

// localFile = config.get('input_file')
// const remoteInputFile = 'in/input.txt';

const remote = true;
var docker = null;

if(remote) {
  // remote connection to docker daemon
    docker = new Docker({
    host:"127.0.0.1",
    port:2375,
  });
} else { 
  // local connection to docker dameon 
  let socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
  let stats  = fs.statSync(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }

  docker = new Docker({ socketPath: socket });
}

const sim_id = config.get("sim_id");
const run_id = config.get("run_id");
const step_number = config.get("step_number");
const target_dir = './' + sim_id + '/' + run_id + '/' + step_number;

// execSync(sender.send_input(localFile, remoteFile));
// .then(() => 
var created_container, statsInterval, counter = 1; 
docker.createContainer({
  Image: config.get('image'),
  Tty: true,  
  //Volume specified in docker createcontainer function using Binds parameter
  Binds: ['/var/lib/docker/volumes/volume_vm/_data/in:/app/in', 
          '/var/lib/docker/volumes/volume_vm/_data/out:/app/out',
          '/var/lib/docker/volumes/volume_vm/_data/work:/app/work'],
})
.then((container) => {created_container = container; return container.start({})})
.then(() => {
  console.log('Container created with ID: ', created_container.id);
  statsInterval = setInterval(function(){ getStats(created_container) }, 1000);    
});

async function getStats(created_container) {
  // if container stops, then stop the timer
  docker.listContainers((err, containers) => {
    let ids = [];
    containers.forEach(function (containerInfo) {
      ids.push(docker.getContainer(containerInfo.Id).id);
      // console.log('id', docker.getContainer(containerInfo.Id).id);
    });
    // console.log(ids);
    // console.log(""+created_container.id);
    if(!ids.includes("" + created_container.id)) {
      // console.log('Stopping stats');
      stopStats();
      // console.log('getting logs');
      // collect logs of th stoppped container
      created_container.logs({follow: false,stdout: true,stderr: true,stdin: true}, (err, stream) => {
        if(err) {
          return logger.error(err.message);
        }
        let filename = target_dir + '/logs.txt';
        fs.writeFile(filename, stream.toString('utf8'), (err, result) => {
          if(err) console.log('error', err);
        });
      });
      return;
    }
    // collect statstics as long as the container is running
    else {  
      // console.log('Collecting statistics');
      created_container.stats({ stream: false }, function (err, stream) {
        if (err) { console.log('error'); }
        var filename = target_dir + '/stats.' + counter + '.txt';
        counter = counter + 1;
        var subset = _.pick(stream, ['cpu_stats', 'memory_stats', 'name', 'id']); //store only required details
        // var subset = _.pick(_.flatten(stream), ['cpu_stats:{cpu_usage}', 'memory_stats', 'name', 'id']); //store only required details
        // fs.writeFile(filename, JSON.stringify(subset, null, ' '), (err, result) => {
        fs.writeFile(filename, JSON.stringify(subset, null, ' '), (err, result) => {
          if(err) console.log('error', err);
        });
        // console.log(stream);
        console.log('Saved to file', filename);
     });
    }
  }); 
}

function stopStats() {
  clearInterval(statsInterval);
}

