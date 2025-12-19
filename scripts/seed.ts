import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import { Product } from "../src/models/Product";
import { Order } from "../src/models/Order";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)];
}
function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function seedProductsIfEmpty() {
  const count = await Product.countDocuments({});
  if (count > 0) return;

  const categories = ["Shoes", "T-Shirts", "Hoodies", "Bags", "Watches", "Electronics"];
  const docs = Array.from({ length: 25 }).map((_, i) => {
    const category = pick(categories);
    const price = randInt(299, 7999);
    const stock = randInt(0, 120);

    return {
      name: `${category} Product ${i + 1}`,
      description: `Seeded product ${i + 1} for dashboard testing.`,
      category,
      price,
      stock,
      sku: `SKU-${category.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(4, "0")}`,
      images: [],
      isActive: true,
    };
  });

  await Product.insertMany(docs);
}

async function seedOrders(days = 90) {
  const products = await Product.find({ isActive: true }).lean();
  if (products.length === 0) throw new Error("No products found.");

  await Order.deleteMany({});

  const now = new Date();
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const orders: any[] = [];

  for (let d = 0; d < days; d++) {
    const day = new Date(from.getTime() + d * 24 * 60 * 60 * 1000);
    const ordersToday = randInt(0, 8);

    for (let o = 0; o < ordersToday; o++) {
      const itemCount = randInt(1, 4);
      const chosen = shuffle(products).slice(0, itemCount);

      const items = chosen.map((p: any) => ({
        productId: new mongoose.Types.ObjectId(p._id),
        quantity: randInt(1, 3),
        price: p.price,
      }));

      const r = Math.random();
      const status = r < 0.9 ? "paid" : r < 0.95 ? "cancelled" : "refunded";

      const createdAt = new Date(day);
      createdAt.setHours(randInt(0, 23), randInt(0, 59), randInt(0, 59), 0);

      orders.push({ status, items, createdAt, updatedAt: createdAt });
    }
  }

  if (orders.length > 0) await Order.insertMany(orders);
  return orders.length;
}

async function main() {
  await connectDB();
  await seedProductsIfEmpty();
  const inserted = await seedOrders(90);
  console.log(`Seed complete. Inserted orders: ${inserted}`);
  await mongoose.connection.close();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.connection.close();
  } catch {}
  process.exit(1);
});
