// https://openbase.com/js/node-sftp-client/documentation

let fs = require('fs')
let Client = require('ssh2-sftp-client');
let sftp = new Client();
let winston_logger = require('./winston_logging');
const logger = winston_logger.logger;

options = {
    host:"127.0.0.1",
    port: 2222, 
    username: 'user1',
    password: 'user1'
}

const sim_id = process.env.SIM_ID;
const run_id = process.env.RUN_ID;
const step_number = process.env.STEP_NUMBER;
const target_dir = './' + sim_id + '/' + run_id + '/' + step_number;
fs.mkdirSync(target_dir, { recursive: true });  // create folder to store the simulation details

async function put_to_Sandbox(localFile, remoteFile, storageFile) {    
    // store input file to the target directory
    fs.copyFileSync(localFile, storageFile);    
    // send input file to the sandbox
    await sftp.connect(options).then(() => {
        return sftp.put(localFile, remoteFile);    
    }).then(() => {
        sftp.end();
    }).catch((err) => {
        throw new Error(err, 'catch error');
    });
    logger.info('Sent simulation input to Sandbox');
}

async function get_from_Sandbox(remoteOutputFile, storeOutputFile) { 
    let dest = fs.createWriteStream( storeOutputFile );
    sftp.connect(options)
    .then(() => {
        // get output file from sandbox
        return sftp.get(remoteOutputFile, dest);
    })    
    .then(() => {
        sftp.end();
    })
    .catch(err => {
        throw new Error(err.message);
    });
    logger.info('Collected simulation output from Sandbox');
}

async function clear_Sandbox() {
    await sftp.connect(options);
    let dirList = ['./in/', './out/', './work/'];
    logger.info('Deleting files from Sandbox after simulation');
    for (const dir of dirList) {
      let fileList = await sftp.list(dir);
      for (const file of fileList) {
        logger.info(dir + file['name'] + ' deleted');
        await sftp.delete(dir + file['name']);
      }
    }
    await sftp.end();
  }

//   the functions can be called separately by uncommenting following lines and passing CLI argument ['get', 'put', or 'clear']
/*
var flag = process.argv[2];

const remoteInputFile = 'in/input.txt';
const remoteOutputFile = 'out/output.txt';
const inputFile = process.env.INPUT_PATH;

fs.mkdirSync(target_dir, { recursive: true });
if(flag == 'put')
    put_to_Sandbox(inputFile, remoteInputFile, target_dir + '/input.txt');
else if(flag == 'get')
    get_from_Sandbox(remoteOutputFile, target_dir + '/' + 'output.txt');
else if (flag == 'clear')
    clear_Sandbox();
*/
module.exports = {put_to_Sandbox, get_from_Sandbox, clear_Sandbox};