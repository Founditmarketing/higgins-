import fs from 'fs/promises';
import path from 'path';

async function test() {
  const dataPath = path.join(process.cwd(), "data/events.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  const events = JSON.parse(raw);
  const idToDelete = events[0].id;
  const updated = events.filter((e: any) => e.id !== idToDelete);
  await fs.writeFile(dataPath, JSON.stringify(updated, null, 2));
  console.log("Deleted", idToDelete);
  console.log("Remaining:", updated.length);
}
test().catch(console.error);
