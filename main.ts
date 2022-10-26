import { Akord } from "@akord/akord-js";
import { NodeJs } from "@akord/akord-js/lib/types/file";

const getEnv = (variable: string): string => {
  const value = process.env[variable];
  if (!value) throw new Error(`Missing environment variable: ${variable}`);
  return value;
};

const { akord } = await Akord.auth.signIn(
  getEnv("AKORD_USERNAME"),
  getEnv("AKORD_PASSWORD")
);

const vaultName = "Simple NFT example";

const vaults = await akord.vault.list();

console.log(vaults);

let vault = vaults.find((v) => v.name === vaultName);
let vaultId: string;
if (vault) {
  console.log(`found vault ${vaultName}`);
  vaultId = vault.id;
} else {
  console.log(`creating vault ${vaultName}`);
  const newVault = await akord.vault.create(vaultName, null, true);
  vaultId = newVault.vaultId;
}

console.log(vaultId);

const filename = "hello.txt";

const stacks = await akord.stack.list(vaultId);
let stack = stacks.find((v) => v.name === filename);
if (!stack) {
  console.log(`create stack ${filename}`);
  const file = new NodeJs.File(filename);
  const { stackId } = await akord.stack.create(vaultId, file, filename);
  stack = await akord.stack.get(stackId);
}
console.log(stack);

const url = `https://arweave.net/${stacks[0].files.at(-1).resourceTx}`;

console.log(url);
