import chalk from "chalk";
import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import readline from "readline";

//#region Initialize
const log = console.log;

log(
  chalk.bgBlue(
    "Hi there， there are some questions to help you init your project."
  )
);

class RlWrapper {
  constructor(rl) {
    this._rl = rl;
    this.lastQes = null;
  }
  question(question, callback) {
    if (this.lastQes) {
      this.lastQes = this.lastQes.then(() => this.processQuestion(question, callback));    
    }
    else
      this.lastQes = this.processQuestion(question, callback);
    return this;
  }
  close() {
    if (this.lastQes)
      this.lastQes.then(() => this._rl.close())
    else
      this._rl.close()
  }
  processQuestion(question, callback) {
    return new Promise((resolve) => {
      this._rl.question(question, (res) => {
        callback(res);
        resolve();
      });
    });
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const rlw = new RlWrapper(rl);

const config = {
  your_domain: '',
  your_second_level_domain: '',
  your_kv_namespace_id: ''
}
//#endregion

//#region init submodule
async function initSubmodule() {
  log(chalk.bgBlue("Init submodule..."));
  execSync('git submodule update --init --recursive', { stdio: 'inherit' })
  log(chalk.green("Init submodule done."))
}
initSubmodule()
//#endregion

//#region ask user for parameter
rlw
.question("Enter your domain(like: www.example.com): ", (domain) => {
  let host_fragment = domain.split('.')
  let zone_name = host_fragment.length == 2 ? domain : `${host_fragment[1]}.${host_fragment[2]}`
  log(chalk.green(`Domain is: ${domain}/worker`));
  log(chalk.green(`Subscription_path is: ${domain}/worker/*`));
  log(chalk.green(`Zone_name is: ${zone_name}`));

  config.your_domain = domain
  config.your_second_level_domain = zone_name
})
.question('Enter your kv_namespaces id: ', (id) => {
  config.your_kv_namespace_id = id

  log(chalk.blue('Start overwrite config files and deploy...'))

  overwriteConfigFiles()
})
.close()
//#endregion

//#region overwrite config
async function overwriteConfigFiles() {
  const noticeConf = (await readFile('./notice/example.wrangler.toml')).toString()
  const noticeBookConf = (await readFile('./notice-book/example.wrangler.toml')).toString()
  
  const noticeConfRes = replace(noticeConf)
  const noticeBookConfRes = replace(noticeBookConf)
  
  await writeFile('./notice/wrangler.toml', noticeConfRes);
  await writeFile('./notice-book/wrangler.toml', noticeBookConfRes);
  
  execDeployJobs()

  // 删除临时配置文件
  execSync('rm ./notice/wrangler.toml ./notice-book/wrangler.toml', { stdio: 'inherit' });

  function replace(conf) {
    return conf.replace(/\[(your_.*?)\]/g, function(_, key) {
      return config[key] ?? ''
    })
  }
}

function execDeployJobs() {
  execSync(`cd notice && pnpm install && pnpx wrangler deploy`, { stdio: 'inherit' });
  execSync('cd notice-book && pnpm install && pnpm run build && pnpx wrangler pages deploy', { stdio: 'inherit' });
  log(chalk.green('Deploy done.'));
}
//#endregion