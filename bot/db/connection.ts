import Surreal from "surrealdb";

const surrealurl = process.env.SURREAL_URL ?? "";
if (surrealurl === "") { console.error("Please provide a SURREAL_URL in .env."); process.exit(1); };
const namespace = process.env.SURREAL_NAMESPACE ?? "";
if (namespace === "") { console.error("Please provide a SURREAL_NAMESPACE in .env."); process.exit(1); };
const database = process.env.SURREAL_DATABASE ?? "";
if (database === "") { console.error("Please provide a SURREAL_DATABASE in .env."); process.exit(1); };
const username = process.env.SURREAL_USERNAME ?? "";
if (username === "") { console.error("Please provide a SURREAL_USERNAME in .env."); process.exit(1); };
const password = process.env.SURREAL_PASSWORD ?? "";
if (password === "") { console.error("Please provide a SURREAL_PASSWORD in .env."); process.exit(1); };

export default async function DB(): Promise<Surreal> {
  const db = new Surreal();
  try {
    await db.connect(surrealurl, {
      auth: {
        username,
        password
      }
    });
    await db.use({ namespace, database });
    return db;
  }
  catch (err) {
    console.error("Failed to connect to SurrealDB:", err instanceof Error ? err.message : String(err));
    await db.close();
    throw err;
  };
};
