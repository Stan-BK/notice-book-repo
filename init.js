import chalk from "chalk";
import { execSync } from "child_process";
import { readFile, writeFile } from "fs/promises";
import readline from "readline";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

//#region Initialize
const log = console.log;
const logGreen = (text) => log(chalk.green(text));
const logYellow = (text) => log(chalk.yellow(text));
const logBlue = (text) => log(chalk.blue(text));
const logBgBlue = (text) => log(chalk.bgBlue(text));

logBgBlue("Hi there, there are some questions to help you init your project.");

class RlWrapper {
  constructor(rl) {
    this._rl = rl;
    this.lastQes = null;
  }
  question(question, callback) {
    if (this.lastQes) {
      this.lastQes = this.lastQes.then(() =>
        this.processQuestion(question, callback)
      );
    } else this.lastQes = this.processQuestion(question, callback);
    return this;
  }
  close() {
    if (this.lastQes) this.lastQes.then(() => this._rl.close());
    else this._rl.close();
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

let [_, $1, $2] = process.env.YOUR_DOMAIN?.split(".");
const config = {
  your_domain: process.env.YOUR_DOMAIN || "",
  your_second_level_domain: process.env.YOUR_DOMAIN.length
    ? `${$1.trim()}.${$2.trim()}`
    : "",
  your_kv_namespace_id: process.env.YOUR_KV_NAMESPACE_ID || "",
};
//#endregion

//#region init submodule
async function initSubmodule() {
  logBgBlue("Init submodule...");
  execSync("git submodule update --init --recursive", { stdio: "inherit" });
  logGreen("Init submodule done.");
}
initSubmodule();
//#endregion

//#region ask user for parameter
// Check if all necessary configurations are set in .env file
const hasAllConfig =
  config.your_domain &&
  config.your_second_level_domain &&
  config.your_kv_namespace_id;

if (hasAllConfig) {
  logGreen(`Reading configuration from .env file:`);
  logGreen(`Domain: ${config.your_domain}/worker`);
  logGreen(`Subscription_path: ${config.your_domain}/worker/*`);
  logGreen(`Zone_name: ${config.your_second_level_domain}`);
  logGreen(`KV Namespace ID: ${config.your_kv_namespace_id}`);

  logBlue("Starting to overwrite config files and deploy...");
  overwriteConfigFiles();
} else {
  logYellow(
    "Complete configuration not found in .env file, please input manually:"
  );

  rlw
    .question(
      `Enter your domain(like: https://www.example.com)${
        config.your_domain ? ` [Current: ${config.your_domain}]` : ""
      }: `,
      (domain) => {
        if ((domain = domain.trim())) {
          let [_, $1, $2] = domain.split(".");
          let zone_name = `${$1.trim()}.${$2.trim()}`;

          logGreen(`Domain is: ${domain}/worker`);
          logGreen(`Subscription_path is: ${domain}/worker/*`);
          logGreen(`Zone_name is: ${zone_name}`);

          config.your_domain = domain.trim();
          config.your_second_level_domain = zone_name;
        }
      }
    )
    .question(
      `Enter your kv_namespaces id${
        config.your_kv_namespace_id
          ? ` [Current: ${config.your_kv_namespace_id}]`
          : " (you need to create kv namespace in Cloudflare and keep its name as `Notice-Book`)"
      }: `,
      (id) => {
        if (id.trim()) {
          config.your_kv_namespace_id = id;
        }

        logBlue("Starting to overwrite config files and deploy...");
        overwriteConfigFiles();
      }
    )
    .close();
}
//#endregion

//#region overwrite config
async function overwriteConfigFiles() {
  const noticeConf = (
    await readFile("./notice/example.wrangler.toml")
  ).toString();
  const noticeBookConf = (
    await readFile("./notice-book/example.wrangler.toml")
  ).toString();

  const noticeConfRes = replace(noticeConf);
  const noticeBookConfRes = replace(noticeBookConf);

  await writeFile("./notice/wrangler.toml", noticeConfRes);
  await writeFile("./notice-book/wrangler.toml", noticeBookConfRes);

  execDeployJobs();

  // Delete temporary config files
  execSync("rm ./notice/wrangler.toml ./notice-book/wrangler.toml", {
    stdio: "inherit",
  });

  function replace(conf) {
    return conf.replace(/\[(your_.*?)\]/g, function (_, key) {
      return config[key] ?? "";
    });
  }
}
//#endregion

//#region exec deploy jobs
function execDeployJobs() {
  execSync("cd notice && pnpm install && pnpx wrangler deploy", {
    stdio: "inherit",
  });
  execSync(
    "cd notice-book && pnpm install && pnpm run build && pnpx wrangler pages deploy",
    { stdio: "inherit" }
  );
  logGreen("Deploy done.");
}
//#endregion
