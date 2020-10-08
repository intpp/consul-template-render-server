import fs from 'fs';
import path from 'path';
import util from 'util';
import { v4 } from 'uuid';
import { exec } from 'child_process';
import buildEnvVariablesString from './buildEnvVariablesString';

const writeFilePromisified = util.promisify(fs.writeFile);
const unlinkPromisified = util.promisify(fs.unlink);
const execPromisified = (command: string) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }

      resolve(stdout);
    });
  });

const command = '/usr/local/bin/consul-template';
const flags = '-vault-renew-token=false -once -dry';

export default async (envVariables: Record<string, string>, template: string, tmpDirPath: string): Promise<string> => {
  const fileName = `${v4()}.tpl`;
  const templatePath = path.resolve(tmpDirPath, fileName);

  await writeFilePromisified(templatePath, template, { encoding: 'utf-8' });

  const result = await execPromisified(
    `env ${buildEnvVariablesString(envVariables)} ${command} ${flags} -template=${templatePath}`
  );

  await unlinkPromisified(templatePath);

  return result.toString().replace(/^\>\s\n/, '');
};
