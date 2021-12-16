let Docker = require('dockerode');
let fs     = require('fs');
let _ = require('lodash/core');
let async = require("async");
let path = require('path'); 
let sftp = require('./sftp_utils');
let winston_logger = require('./winston_logging');
const logger = winston_logger.logger;

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

const sim_id = process.env.SIM_ID;
const run_id = process.env.RUN_ID;
const step_number = process.env.STEP_NUMBER;
const target_dir = './' + sim_id + '/' + run_id + '/' + step_number;
const pollingInterval = 500; // polling interval for collecting stats from running container
var created_container, statsInterval, counter =1, stopStatsFlag; 
const inputFile = process.env.INPUT_PATH;
const remoteInputFile = 'in/input.txt';
const remoteOutputFile = 'out/output.txt';
const storeInputFile = target_dir + '/input.txt'
const storeOutputFile = target_dir + '/' + 'output.txt';

sftp.put_to_Sandbox(inputFile, remoteInputFile, storeInputFile);

function startSimulation() {
  logger.info('Starting simulation in Sandbox');
  docker.createContainer({
    Image: process.env.IMAGE,
    Tty: true,  
    //Volume specified in docker createcontainer function using Binds parameter
    Binds: ['/var/lib/docker/volumes/volume_vm/_data/in:/app/in', 
            '/var/lib/docker/volumes/volume_vm/_data/out:/app/out',
            '/var/lib/docker/volumes/volume_vm/_data/work:/app/work'],
  })
  .then((container) => {created_container = container; return container.start({})})
  .then(() => {
    logger.info('New container created with ID: '+ created_container.id);
    statsInterval = setInterval(function(){ getStats(created_container) }, pollingInterval);
  });
}
// start simulation after a delay for the input files to be send to sandbox
setTimeout(() => {startSimulation()}, 1000);

async function getStats (created_container) {
  // check if the container is running
  let ids = [];
  let containers = await docker.listContainers(); 
  containers.forEach(function (containerInfo) {
      ids.push(docker.getContainer(containerInfo.Id).id);
  });
  // continue collecting stats if the container is still running
  if(ids.includes("" + created_container.id)) {
    await created_container.stats({ stream: false }, function (err, stream) {
      if (err) { throw new Error('error'); }
      var filename = target_dir + '/stats.' + counter + '.json';
      counter = counter + 1;
      fs.writeFile(filename, JSON.stringify(stream, null, ' '), (err, result) => {
        if(err) throw new Error('error', err);
      });
    });
  }
  else { // stop collecting stats if the container stopped running
    logger.info('Completed execution of container');
    await stopStats();
    setTimeout(() => {parseStats()}, 1000);
     // collect logs of the stoppped container
    await created_container.logs({follow: false,stdout: true,stderr: true,stdin: true}, (err, stream) => {
      if(err) {
        return logger.error(err.message);
      }
      let filename = target_dir + '/logs.txt';
      fs.writeFile(filename, stream.toString('utf8'), (err, result) => {
        if(err) throw new Error('error', err);
      });
    });
    logger.info('Collected logs from Sandbox');
    //  get output from Sandbox
    await sftp.get_from_Sandbox(remoteOutputFile, storeOutputFile);
    //  clear all files created during simulation 
    await sftp.clear_Sandbox();
    logger.info('Stored simulation details to '+ target_dir);
    return;
  }
}


function stopStats() {
  return new Promise((resolve) => {
    resolve(clearInterval(statsInterval));
  });
}

async function parseStats() {
  const dirName = target_dir;
  let stats = [];
  for (let i = 1; i < counter; i++) {
    const filename = path.join(dirName, 'stats.'+i+'.json');
    data = fs.readFileSync(filename, { encoding: "utf-8" });
    try {
      const fileContent = JSON.parse(data);
      fs.unlinkSync(filename); //delete temporary stats file after extracting required values
      if(fileContent['read'].startsWith("0001-01-01T00:00:00Z")) 
        continue;        
      let timestamp = fileContent['read'];
      let cpu = fileContent['cpu_stats']['cpu_usage']['total_usage'];
      let memory = fileContent['memory_stats']['usage'];
      let memory_max = fileContent['memory_stats']['max_usage'];
      let net = fileContent['networks']['eth0']['rx_bytes'];
      stats.push({timestamp, cpu, memory, memory_max, net});
      } catch (err) {
        throw new Error(`error while parsing file: ${fullFilename}`);
      }
  }  
  let json = JSON.stringify(stats, null, ' ');
  fs.appendFileSync(target_dir + '/statistics.json', json);
}
