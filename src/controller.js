var Docker = require('dockerode');
var fs     = require('fs');
let config = require('config')
let _ = require('lodash/core');
let async = require("async");
const path = require('path'); 


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
const pollingInterval = 500;

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
  statsInterval = setInterval(function(){ getStats(created_container) }, pollingInterval);    
});

async function getStats(created_container) {
  // if container stops, then stop the timer
  docker.listContainers((err, containers) => {
    let ids = [];
    containers.forEach(function (containerInfo) {
      ids.push(docker.getContainer(containerInfo.Id).id);
    });

    if(!ids.includes("" + created_container.id)) {
      stopStats();
      parseStats();

      // collect logs of the stoppped container
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
      created_container.stats({ stream: false }, function (err, stream) {
        if (err) { console.log('error'); }
        var filename = target_dir + '/stats.' + counter + '.json';
        counter = counter + 1;
        fs.writeFile(filename, JSON.stringify(stream, null, ' '), (err, result) => {
          if(err) console.log('error', err);
        });
     });
    }
  }); 
}

function stopStats() {
  clearInterval(statsInterval);
}

async function parseStats() {
  const dirName = target_dir;
  fileList = fs.readdirSync(dirName);
  let stats = [];
  for (let i = 0; i < fileList.length; i++) {
    const filename = fileList[i];
    if (!filename.startsWith("stats")) continue;

    const fullFilename = path.join(dirName, filename);
    data = fs.readFileSync(fullFilename, { encoding: "utf-8" });
      
        try {
          const fileContent = JSON.parse(data);
          if(fileContent['read'].startsWith("0001-01-01T00:00:00Z"))
            break;
          
          let timestamp = fileContent['read'];
          let cpu = fileContent['cpu_stats']['cpu_usage']['total_usage'];
          let memory = fileContent['memory_stats']['usage'];
          let memory_max = fileContent['memory_stats']['max_usage'];
          let net = fileContent['networks']['eth0']['rx_bytes'];
          stats.push({timestamp, cpu, memory, memory_max, net});
          
        } catch (err) {
          console.error(`error while parsing file: ${fullFilename}`);
        }
       
  }
  console.log(stats);
  let json = JSON.stringify(stats, null, ' ');
  fs.appendFileSync(target_dir + '/statistics.json', json);

}
