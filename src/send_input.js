// https://openbase.com/js/node-sftp-client/documentation

let fs = require('fs')
let config = require('config')
let Client = require('ssh2-sftp-client');
let sftp = new Client();
let data = fs.createReadStream('./sample_input.txt');

localFile = config.get('sample_input_file')
remoteFile = config.get('remote_sftp_dir') + '/in/input.txt'

function send_input(localFile, remoteFile) {
    sftp.connect({
        host:"127.0.0.1",
        port: 2222, 
        username: 'user1',
        password: 'user1'
    }).then(() => {
        // return sftp.list('_data');
        return sftp.put(localFile, remoteFile);    
        // sftp.put(data, '_data/in/input.txt');
    }).then(() => {
        sftp.end();
    }).catch((err) => {
        console.log(err, 'catch error');
    });
}
send_input(localFile, remoteFile);
module.exports = {send_input};