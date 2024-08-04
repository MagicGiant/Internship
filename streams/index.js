const { getConfig } = require('./src/configReader');
const FileHandler = require('./src/fileHandler');
const Logger = require('./src/logger');
const {ToUpperCase, ToUpperCaseBuilder} = require('./src/transform/strategies/ToUpperCase');
const path = require('path');
const {Filter, FilterBuilder} = require('./src/transform/strategies/Filter');
const TextTransformBuilder = require('./src/transform/textTransformBuilder');
const { AddLineNumber, AddLineNumberBuilder } = require('./src/transform/strategies/AddLineNumber');
const OutputArchiver = require('./src/outputArchiver');
const EmailSendler = require('./src/emailSender');

let logger = new Logger();
logger.clearLogs();

const configPath = path.join(__dirname, './src/Config.json');
const config = getConfig(configPath);

async function processFiles() {
  const fileHandler = new FileHandler(
    config,
    logger,
    new TextTransformBuilder(
      [
        new FilterBuilder(config),
        new ToUpperCaseBuilder(),
      ],
      [
        new AddLineNumberBuilder()
      ]
    )
  );
  
  await fileHandler.processFiles();
}

async function main() {
  await processFiles();

  let outputArchiver = new OutputArchiver(config, logger);
  await outputArchiver.archiveOutputs();

  let emailSendler = new EmailSendler(config, logger);

  logger.addLog(logger.getResultStr());

  await emailSendler.send();
}

main();
