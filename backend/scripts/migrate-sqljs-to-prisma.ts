import path from "path";
import fs from "fs";
import initSqlJs from "sql.js";
import prisma from "../src/prismaClient";

type Product = {
  id: string;
  name: string;
  count: number;
  price: number;
  groupType?: string | null;
  status: string;
};

async function readFromJson(jsonPath: string): Promise<Product[] | null> {
  if (!fs.existsSync(jsonPath)) return null;
  const raw = fs.readFileSync(jsonPath, "utf-8");
  try {
    const items = JSON.parse(raw) as Product[];
    return items;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return null;
  }
}

async function readFromSqlite(dbFile: string): Promise<Product[] | null> {
  if (!fs.existsSync(dbFile)) return null;
  const SQL = await initSqlJs({ locateFile: (file: string) => file });
  const filebuffer = fs.readFileSync(dbFile);
  const db = new SQL.Database(new Uint8Array(filebuffer));
  try {
    const res = db.exec("SELECT id, name, count, price, groupType, status FROM products");
    if (!res || res.length === 0) return [];
    const { columns, values } = res[0];
    return values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((c: string, i: number) => (obj[c] = row[i]));
      return obj as Product;
    });
  } catch (e) {
    console.error("Failed to read sqlite", e);
    return null;
  } finally {
    db.close();
  }
}

async function migrate() {
  const root = path.resolve(__dirname, "..");
  const dataDir = path.resolve(root, "data");
  const jsonPath = path.resolve(dataDir, "products.json");
  const dbFile = path.resolve(dataDir, "db.sqlite");

  let products: Product[] | null = await readFromJson(jsonPath);
  if (!products) {
    products = await readFromSqlite(dbFile);
  }

  if (!products) {
    console.log("No legacy data found to migrate.");
    process.exit(0);
  }

  console.log(`Found ${products.length} products to migrate.`);

  for (const p of products) {
    try {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          count: Math.floor(Number(p.count) || 0),
          price: Number(p.price) || 0,
          groupType: p.groupType ?? null,
          status: p.status as any,
        },
        create: {
          id: p.id,
          name: p.name,
          count: Math.floor(Number(p.count) || 0),
          price: Number(p.price) || 0,
          groupType: p.groupType ?? null,
          status: p.status as any,
        },
      });
    } catch (e) {
      console.error(`Failed to upsert product ${p.id}`, e);
    }
  }

  console.log("Migration complete.");
  await prisma.$disconnect();
}

if (require.main === module) {
  migrate().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
