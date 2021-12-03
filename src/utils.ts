import _ from 'lodash';

export const randomString = (length: number) => {
  return Math.random().toString(36).slice(2).slice(0, length);
};

export const codeblockMsg = (message: string): string => {
  return _.upperFirst(`\`\`\`${message}\`\`\``);
};

export function formatDiscordMessage(object: object): string {
  return _.reduce(
    object,
    (acc: string[], value, key) => _.concat(acc, `${key}: ${value}`),
    []
  ).join('\n');
}
