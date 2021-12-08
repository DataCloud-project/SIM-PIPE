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

function send_input(localFile, remoteFile) {
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

function receive_output(remoteOutputFile, ) { 
    let dest = fs.createWriteStream(target_dir + '/' + 'output.txt'  );
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

function clear_storage() {     
    sftp.connect(options)
    .then(() => {
        return sftp.rmdir('work', true);
    })
    // .then(() => {
    //     // flush out in, out and work folders in the sandbox for the next simulation
        
    // })
    // .then(() => {
    //     // flush out in, out and work folders in the sandbox for the next simulation
    //     sftp.delete(remoteOutputFile);
    // })
    .then(() => {
        sftp.end();
    })
    .catch(err => {
        console.error(err.message);
    });
}

fs.mkdirSync(target_dir, { recursive: true });
if(flag == 'put')
    send_input(inputFile, remoteInputFile);
else if(flag == 'get')
    receive_output(remoteOutputFile, remoteInputFile);
else if (flag == 'clear')
    clear_storage()
module.exports = {send_input, receive_output};