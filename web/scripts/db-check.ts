// npm run db:check : la base répond-elle, et les migrations sont-elles à jour ?
import { config } from "dotenv";

import { checkDatabase } from "../src/lib/db/diagnostic";

config({ path: ".env.local", quiet: true });

async function main() {
  const status = await checkDatabase(process.env.DATABASE_URL);
  if (status.ok) {
    console.log(`✓ Base joignable, ${status.applied}/${status.expected} migrations appliquées.`);
  } else {
    console.error(`✖ ${status.problem}`);
    process.exitCode = 1;
  }
}

main();
