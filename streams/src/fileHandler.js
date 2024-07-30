const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const Logger = require('./logger');

class FileHandler {
  constructor(config, transformBuilder) {
    this.config = config;
    this.transformBuilder = transformBuilder;
    this.logger = new Logger();
  }

  processFile(inputPath, outputPath) {
    this.createFile(outputPath);

    const readableStream = fs.createReadStream(inputPath, { 
      encoding: 'utf8',
      highWaterMark: 40
    });

    let transform = this.transformBuilder.create();

    readableStream
      .on('error', (error) => {
        this.logger.addLog(`Error reading from ${inputPath}:`, error);
      })
      .pipe(transform)
      .pipe(this.writeThrough(outputPath))
      .on('finish', () => {
        this.logger.addLog(`Finished processing ${inputPath}`);
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
      this.logger.addLog(`Writing chunk to ${outputPath}:\n${chunk}`);
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
