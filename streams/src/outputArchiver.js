const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

class OutputArchiver{
  constructor(config, logger){
    this.config = config;
    this.logger = logger;

    this.output = fs.createWriteStream(path.join(config.filesDirectory, '/output.zip'));
    this.archive = archiver('zip', {
      zlib: { level: 9 }
    });

    this.output.on('close', function() {
      logger.addLog('archiver has been finalized and the output file descriptor has closed.');
    });
    
    this.output.on('end', function() {
      logger.addLog('Data has been drained');
    });
    
    this.archive.on('error', function(err) {
      logger.addLog(err)
    });

    this.archive.pipe(this.output);
  }

  archiveOutputs() {
    for (let name of this.config.outputFiles) {
      const filePath = path.join(this.config.filesDirectory, name);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (fileContent.trim()) {
          this.archive.append(fileContent, { name });
        } else {
          console.log(`File ${name} is empty.`);
        }
      } else {
        console.log(`File ${name} does not exist.`);
      }
    }
    this.archive.finalize();
  }
}

module.exports = OutputArchiver;