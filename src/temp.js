var Client = require('ssh2').Client;

var connSettings = {
    host: 'localhost',
    port: 2222, 
    username: 'user1',
    password: 'user1'
    // key file
};

var conn = new Client();
conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
        //  if (err) throw err;
         // into sftp
         sftp.readdir('/home/user1/_data', function(err, list) {
            // if (err) throw err;
            // List the directory in the console
            console.log(list);
            console.dir(list);
            // Do not forget to close the connection, otherwise you'll get troubles
            conn.end();
     });
    });
}).connect(connSettings);