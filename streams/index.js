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

async function f() {
  // Создаю логи и удаляю всю информацию в существующем файле логов
  let logger = new Logger();
  logger.clearLogs();

  // Подгружаю конфиг
  const configPath = path.join(__dirname, './src/Config.json');
  const config = getConfig(configPath);

  // Создаю обработчик файлов с билдером Transform для потоков
  const fileHandler = new FileHandler(
    config,
    logger,
    new TextTransformBuilder(
      [
        new FilterBuilder(config),
      ],
      [
        new AddLineNumberBuilder(),
        new ToUpperCaseBuilder()
      ]
    )
  );

  // Запускаю обработку файлов
  await fileHandler.processFiles();

  // создаю архиватор и архивирую сгенерированные файлы
  let outputArchiver = new OutputArchiver(config, logger);
  await outputArchiver.archiveOutputs();

  //отправляю отчет
  let emailSendler = new EmailSendler(config, logger);
  await emailSendler.send();

  //сохраняю отчет в логах
  logger.addLog(logger.getResultStr());
}
f();

