const fs = require('fs');
const path = require('path'); 
let async = require('async')
let Client = require('ssh2-sftp-client');
let sftp = new Client();
let config = require('config')

options = {
  host:"127.0.0.1",
  port: 2222, 
  username: 'user1',
  password: 'user1'
}

async function cleanSandbox() {
  // store input file to the target directory
  fs.copyFileSync(localFile, target_dir + '/input.txt');
  
  // send input file to the sandbox
  sftp.connect(options).then(() => {
      return sftp.put(localFile, remoteFile);    
  }).then(() => {
      sftp.end();
  }).catch((err) => {
      console.log(err, 'catch error');
  });
}

async function main() {
  await sftp.connect(options);
  let dirList = ['./in/', './out/', './work/'];
  for (const dir of dirList) {
    let fileList = await sftp.list(dir);
    for (const file of fileList) {
      console.log(file['name']);
      await sftp.delete(dir + file['name']);
    }
  }
  await sftp.end();
}

main().catch((e) => {
  console.error(e.message);
});

// const dirName = 'C:\\Users\\aleenat\\OneDrive - SINTEF\\Git\\SIM-PIPE-backend\\src\\sim_01\\1\\4';
// fileList = fs.readdirSync(dirName);
// let stats = [];
//   for (let i = 0; i < fileList.length; i++) {
//     const filename = fileList[i];
//     if (!filename.startsWith("stats")) continue;

//     const fullFilename = path.join(dirName, filename);
//     data = fs.readFileSync(fullFilename, { encoding: "utf-8" });
      
//         try {
//           const fileContent = JSON.parse(data);
//           if(fileContent['read'].startsWith("0001-01-01T00:00:00Z"))
//             break;
          
//           let timestamp = fileContent['read'];
//           let cpu = fileContent['cpu_stats']['cpu_usage']['total_usage'];
//           let memory = fileContent['memory_stats']['usage'];
//           let memory_max = fileContent['memory_stats']['max_usage'];
//           let net = fileContent['networks']['eth0']['rx_bytes'];
//           stats.push({timestamp, cpu, memory, memory_max, net});
          
//         } catch (err) {
//           console.error(`error while parsing file: ${fullFilename}`);
//         }
       
//   }
//   let json = JSON.stringify(stats, null, ' ');
//   fs.appendFileSync('statistics.json', json);
