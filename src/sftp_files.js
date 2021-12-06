// https://openbase.com/js/node-sftp-client/documentation

let fs = require('fs')
let config = require('config')
let Client = require('ssh2-sftp-client');
let sftp = new Client();

var flag = process.argv[2];

localFile = config.get('sample_input_file')
remoteInputFile = config.get('remote_sftp_dir') + '/in/input.txt'
remoteOutputFile = config.get('remote_sftp_dir') + '/out/output.txt'

options = {
    host:"127.0.0.1",
    port: 2222, 
    username: 'user1',
    password: 'user1'
}

function send_input(localFile, remoteFile) {
    sftp.connect(options).then(() => {
        // return sftp.list('_data');
        return sftp.put(localFile, remoteFile);    
        // sftp.put(data, '_data/in/input.txt');
    }).then(() => {
        sftp.end();
    }).catch((err) => {
        console.log(err, 'catch error');
    });
}

function receive_output(remoteFile) {
    let dest = fs.createWriteStream('copy.txt');
    sftp.connect(options)
    .then(() => {
        return sftp.get(remoteFile, dest);
    })
    .then(() => {
        sftp.end();
    })
    .catch(err => {
        console.error(err.message);
    });
}
if(flag == 'put')
    send_input(localFile, remoteInputFile);
else
    receive_output(remoteOutputFile);
module.exports = {send_input, receive_output};