import { redis } from "bun";
import { chatterApi } from ".";

export class User {
  constructor(username: string) {
    this.username = username;
  };

  public username: string;
  public id: string | undefined | null; // The null here and below serves the function to make typescript shut the fuck up
  public displayName: string | undefined | null;

  static async init(username: string): Promise<User | null> {
    const userObj = new User(username);
    const cachedata = await redis.exists(`user:${username}`);
    if (!cachedata) {
      const twitchdata = await chatterApi.users.getUserByName(username!);
      if (!twitchdata) return null; // User does not exist in redis and twitch api can't get them: return null
      await redis.set(`user:${username}:id`, twitchdata.id);
      await redis.set(`user:${username}:displayName`, twitchdata.displayName);
      await redis.set(`user:${username}:itemlock`, '0');
    };
    await userObj._setOptions();
    return userObj;
  };

  private async _setOptions(): Promise<void> {
    this.id = await redis.get(`user:${this.username}:id`);
    this.displayName = await redis.get(`user:${this.username}:displayName`);
  };

  public async itemLock(): Promise<boolean> {
    const lock = await redis.get(`user:${this.username}:itemlock`);
    if (lock === '0') return false;
    return true;
  };

  public async setLock(): Promise<void> {
    await redis.set(`user:${this.username}:itemlock`, '1');
  };

  public async clearLock(): Promise<void> {
    await redis.set(`user:${this.username}:itemlock`, '0');
  };
};
