import { updateUserRecord } from "../db/dbUser";
import { type userRecord } from "../db/connection";
import { User } from "../user";

export async function changeBalance(user: User, userRecord: userRecord, amount: number): Promise<false | userRecord> {
  userRecord.balance = userRecord.balance += amount;
  if (userRecord.balance < 0) return false;
  await updateUserRecord(user, userRecord);
  return userRecord;
};
