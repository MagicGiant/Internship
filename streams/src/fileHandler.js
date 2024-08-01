const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const Logger = require('./logger');

class FileHandler {
  constructor(config, logger, transformBuilder) {
    this.config = config;
    this.transformBuilder = transformBuilder;
    this.logger = logger;
  }

  async processFile(inputPath, outputPath) {
    this.createFile(outputPath);

    const readableStream = fs.createReadStream(inputPath, { 
      encoding: this.config.encoding,
      highWaterMark: this.config.highWaterMark
    });

    let transform = this.transformBuilder.create(this.config, this.logger);

    readableStream
      .on('error', (error) => {
        this.logger.addLog(`Error reading from ${inputPath}:`, error);
      })
      .pipe(transform)
      .pipe(await this.writeThrough(outputPath))
      .on('finish', () => {
        this.logger.addLog(`Finished processing ${inputPath}`);
      });
  }

  async processFiles() {
    const tasks = this.config.inputFiles.map((inputFile, i) => {
      let inputPath = path.join(this.config.filesDirectory, inputFile);
      let outputPath = path.join(this.config.filesDirectory, this.config.outputFiles[i]);
      
      return this.processFile(inputPath, outputPath).catch(error => {
        this.logger.addLog(`Error processing file ${inputPath}: ${error}`);
      });
    });
  
    await Promise.all(tasks);
  }

  async writeThrough(outputPath) {
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
