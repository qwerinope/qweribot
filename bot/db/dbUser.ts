import pocketbase, { type userRecord } from "./connection";
import { emptyInventory, itemarray } from "../items";
import type { User } from "../user";
const pb = pocketbase.collection('users');

/** Use this function to both ensure existance and to retreive data */
export async function getUserRecord(user: User): Promise<userRecord> {
  try {
    const data = await pb.getOne(user.id);

    if (Object.keys(data.inventory).sort().toString() !== itemarray.sort().toString()) { // If the items in the user inventory are missing an item.
      itemarray.forEach(key => {
        if (!(key in data.inventory)) Object.defineProperty(data.inventory, key, { value: 0 });
      });
    };

    return data;
  } catch (err) {
    // This gets triggered if the user doesn't exist in the database
    return await createUserRecord(user);
  };
};

async function createUserRecord(user: User): Promise<userRecord> {
  const data = await pb.create({
    id: user.id,
    username: user.username,
    balance: 0,
    inventory: emptyInventory,
    lastlootbox: new Date(0).toISOString()
  });

  return data;
};

export async function updateUserRecord(user: User, newData: userRecord): Promise<boolean> {
  try {
    await pb.update(user.id, newData);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  };
};
