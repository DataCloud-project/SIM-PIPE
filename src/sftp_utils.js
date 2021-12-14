// https://openbase.com/js/node-sftp-client/documentation

let fs = require('fs')
let config = require('config')
let Client = require('ssh2-sftp-client');
let sftp = new Client();

var flag = process.argv[2];

const inputFile = config.get('input_file');
// const remoteInputFile = config.get('remote_sftp_dir') + '/in/input.txt';
// const remoteOutputFile = config.get('remote_sftp_dir') + '/out/output.txt';

const remoteInputFile = 'in/input.txt';
const remoteOutputFile = 'out/output.txt';

const sim_id = config.get("sim_id");
const run_id = config.get("run_id");
const step_number = config.get("step_number");

const target_dir = './' + sim_id + '/' + run_id + '/' + step_number;

options = {
    host:"127.0.0.1",
    port: 2222, 
    username: 'user1',
    password: 'user1'
}

async function put_to_Sandbox(localFile, remoteFile, storageFile) {
    // store input file to the target directory
    fs.copyFileSync(localFile, storageFile);
    
    // send input file to the sandbox
    sftp.connect(options).then(() => {
        return sftp.put(localFile, remoteFile);    
    }).then(() => {
        sftp.end();
    }).catch((err) => {
        console.log(err, 'catch error');
    });
}

async function get_from_Sandbox(remoteOutputFile, storeOutputFile) { 
    let dest = fs.createWriteStream( storeOutputFile );
    sftp.connect(options)
    .then(() => {
        return sftp.get(remoteOutputFile, dest);
    })    
    .then(() => {
        sftp.end();
    })
    .catch(err => {
        console.error(err.message);
    });
}

async function clear_Sandbox() {
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

fs.mkdirSync(target_dir, { recursive: true });
if(flag == 'put')
    put_to_Sandbox(inputFile, remoteInputFile, target_dir + '/input.txt');
else if(flag == 'get')
    get_from_Sandbox(remoteOutputFile, target_dir + '/' + 'output.txt');
else if (flag == 'clear')
    clear_Sandbox();
module.exports = {put_to_Sandbox, get_from_Sandbox, clear_Sandbox};