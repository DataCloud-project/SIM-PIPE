const fs = require('fs');
const path = require('path'); 
let async = require('async')

const dirName = 'C:\\Users\\aleenat\\OneDrive - SINTEF\\Git\\SIM-PIPE-backend\\src\\sim_01\\1\\4';
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
  let json = JSON.stringify(stats, null, ' ');
  fs.appendFileSync('statistics.json', json);
