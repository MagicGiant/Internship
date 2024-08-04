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

  // Запускаю поток. Так как для каждого потока нужен новый объект transform,
  // я использую свой билдер с методом create.
  async processFile(inputPath, outputPath) {
    this.createFile(outputPath);

    const readableStream = fs.createReadStream(inputPath, { 
      encoding: this.config.encoding,
      highWaterMark: this.config.highWaterMark
    });


    let transform = this.transformBuilder.create(this.config, this.logger);

    

    return new Promise((resolve, reject) => {
      readableStream
        .on('error', (error) => {
          this.logger.addLog(`Error reading from ${inputPath}: ${error}`);
          reject(error);
        })
        .pipe(transform)
        .pipe( this.writeThrough(outputPath))
        .on('finish', () => {
          this.logger.addLog(`Finished processing ${inputPath}`);
          resolve();
        })
        .on('error', (error) => {
          this.logger.addLog(`Error writing to ${outputPath}: ${error}`);
          reject(error);
        });
    });
  }

  //асинхронно запускаю processFile для каждого файла в конфиге
  async processFiles() {
    const tasks = this.config.inputFiles.map((inputFile, i) => {
      let inputPath = path.join(this.config.filesDirectory, inputFile);
      let outputPath = path.join(this.config.filesDirectory, this.config.outputFiles[i]);
      
      return this.processFile(inputPath, outputPath).catch(error => {
        this.logger.addLog(`Error processing file ${inputPath}: ${error}`);
      });
    });
    return Promise.all(tasks);
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
