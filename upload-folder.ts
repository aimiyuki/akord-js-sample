import { Akord } from "@akord/akord-js";
import { NodeJs } from "@akord/akord-js/lib/types/file";
import { globby } from "globby";

const getEnv = (variable: string): string => {
  const value = process.env[variable];
  if (!value) throw new Error(`Missing environment variable: ${variable}`);
  return value;
};

const { akord } = await Akord.auth.signIn(
  getEnv("AKORD_USERNAME"),
  getEnv("AKORD_PASSWORD")
);

const vaultName = "Photos from the Showa period";

const vaults = await akord.vault.list();

let vault = vaults.find((v) => v.name === vaultName);
let vaultId: string;
if (vault) {
  console.log(`found vault ${vaultName}`);
  vaultId = vault.id;
} else {
  throw new Error(`Vault ${vaultName} not found`);
}

const stacks = await akord.stack.list(vaultId);

const filenames = stacks.map((s) => s.name);

const allFiles = await globby("*.jpg");
const toUpload = allFiles.filter((f) => !filenames.includes(f));

for (const filename of toUpload) {
  const file = NodeJs.File.fromPath(filename);
  const { stackId } = await akord.stack.create(vaultId, file, filename);
  await akord.stack.get(stackId);
  console.log(`Uploaded ${filename}`);
}
