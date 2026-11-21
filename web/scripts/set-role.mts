// Change le rôle d'un membre, par exemple pour désigner le premier administrateur :
//   npm run role -- alice@example.org admin
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import { user } from "../src/lib/db/schema/auth";

config({ path: ".env.local" });

const ROLES = ["membre", "moderateur", "admin"];
const [email, role] = process.argv.slice(2);

if (!email || !ROLES.includes(role)) {
  console.error(`Usage : npm run role -- <email> <${ROLES.join("|")}>`);
  process.exit(1);
}

const db = drizzle(process.env.DATABASE_URL!);
const updated = await db
  .update(user)
  .set({ role })
  .where(eq(user.email, email.toLowerCase()))
  .returning({ pseudo: user.name });

if (updated.length === 0) {
  console.error(`Aucun membre avec l'adresse ${email}.`);
  process.exit(1);
}
console.log(`${updated[0].pseudo} a maintenant le rôle « ${role} ».`);
process.exit(0);
