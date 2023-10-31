import chalk from 'chalk';

const MESSAGE_TYPES = {
  info: chalk.magenta,
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
} as const;

const MESSAGE_PREFIX = '[sobriquet] 🌎' as const;

type MessageType = keyof typeof MESSAGE_TYPES;

export const createMessage =
  (logsEnabled: boolean = true) =>
  (message: string, type: MessageType = 'info') => {
    if (logsEnabled === false) {
      return;
    }
    const date = new Date().toLocaleTimeString();
    const prefix = chalk.bold(MESSAGE_TYPES[type](MESSAGE_PREFIX));
    console.log(date, prefix, MESSAGE_TYPES[type](message));
  };
