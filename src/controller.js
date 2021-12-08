var Docker = require('dockerode');
var fs     = require('fs');
let config = require('config')

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
var created_container; 
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
  let ID = created_container.id;  
  console.log('Container ID: ', ID);
  created_container.wait();
  return ID;
})
.then((ID) => {
  created_container.logs({follow: false,stdout: true,stderr: true,stdin: true}, (err, stream) => {
    if(err) {
      return logger.error(err.message);
    }
    // let filename = './logs_'+ ID +'.txt'	//filename with container id
    let filename = target_dir + '/logs.txt';
    fs.writeFile(filename, stream.toString('utf8'), (err, result) => {
      if(err) console.log('error', err);
    });
    // console.log('Container logs saved to file', filename);
  });
});


// async function controller() {
//   await start_container();

// }

// function start_container() {
//   return new Promise(resolve => {
//     container.start();
//     resolve();
//   });
// }

// function wait_for_container(container) {
//   let ID = container.id  
//   console.log('Container ID: ', ID);
//   container.wait(
// }
/*
docker.createContainer({
  Image: config.get('image'),
  Tty: true,  
  Binds: ['/var/lib/docker/volumes/volume_vm/_data/in:/app/in', 
          '/var/lib/docker/volumes/volume_vm/_data/out:/app/out',
          '/var/lib/docker/volumes/volume_vm/_data/work:/app/work'],
}, (err, container) => {
    
      container.start({}, (err, data) => {  
        let ID = container.id  
        console.log('Container ID: ', ID);

        container.wait((err, data) => {
          // get container logs on exit
          container.logs({follow: false,stdout: true,stderr: true,stdin: true}, (err, stream) => {
            if(err) {
              return logger.error(err.message);
            }
            let filename = './logs_'+ ID +'.txt'	//filename with container id
            fs.writeFile(filename, stream.toString('utf8'), (err, result) => {
              if(err) console.log('error', err);
            });
            console.log('Container logs saved to file', filename);
          
          });
        });    
      });
});
 volumes: 'volume_vm:/app'
 volumes: ['volume_vm:/app']
 volumes: {'volume_vm:/app'} - compile error
 volumes: "volume_vm:/app"
 volumes: {
    "volume_vm": "/app" 
    }
 volumes: {
    "/var/lib/docker/volumes/volume_vm/_data": "/app" 
    }
 volumes: {
    "/var/lib/docker/volumes/volume_vm/": "/app" 
    }
  HostConfig : {
    Binds: ["/var/lib/docker/volumes/volume_vm/_data:/app"]
  }
  HostConfig: {
    Binds: ['/var/lib/docker/volumes/volume_vm/_data:/app']
  }
  Binds: ['/var/lib/docker/volumes/volume_vm/_data:/app']

  */