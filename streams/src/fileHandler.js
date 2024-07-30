const fs = require('fs');
const path = require('path');
const { PassThrough, Transform } = require('stream');
const Logger = require('./logger');

class FileHandler {
  constructor(config, transformBuilder = null) {
    this.config = config;
    this.transformBuilder = transformBuilder || new PassThrough();
    this.logger = new Logger();
  }

  processFile(inputPath, outputPath) {
    this.createFile(outputPath);


    const readableStream = fs.createReadStream(inputPath, { 
      encoding: 'utf8',
      highWaterMark: 40
    });

    const writeStream = this.writeThrough(outputPath);

    let transform = this.transformBuilder.create();

    return new Promise((resolve, reject) => {

      readableStream
        .on('error', (error) => {
          this.logger.addLog(`Error reading from ${inputPath}:`, error);
          reject(error);
        })
        .pipe(transform)
        .on('error', (error) => {
          this.logger.addLog(`Error in transform stream for ${inputPath}:`, error);
          reject(error);
        })
        .pipe(writeStream)
        .on('error', (error) => {
          this.logger.addLog(`Error writing to ${outputPath}:`, error);
          reject(error);
        })
        .on('finish', () => {
          this.logger.addLog(`Finished processing ${inputPath}`);
          resolve();
        });
    });
  }

  async processFiles() {
    for (let i = 0; i < this.config.inputFiles?.length; i++) {
      let inputPath = path.join(this.config.filesDirectory, this.config.inputFiles[i]);
      let outputPath = path.join(this.config.filesDirectory, this.config.outputFiles[i]);

      try {
        this.processFile(inputPath, outputPath);
      } catch (error) {
        this.logger.addLog(`Error processing file ${inputPath}:`, error);
      }
    }
  }

  writeThrough(outputPath) {
    const outDataThrough = new PassThrough();

    outDataThrough.on('data', (chunk) => {
      this.logger.addLog(`Writing chunk to ${outputPath}: ${chunk}`);
      fs.appendFileSync(outputPath, chunk, 'utf8');
    });

    outDataThrough.on('finish', () => {
      this.logger.addLog(`Finished writing to ${outputPath}`);
    });

    return outDataThrough;
  }

  createFile(outputPath) {
    fs.writeFileSync(outputPath, '');
    this.logger.addLog(`Created file ${outputPath}`);
  }
}

module.exports = FileHandler;
