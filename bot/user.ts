import { redis } from "bun";
import { chatterApi } from ".";
import { HelixUser } from "@twurple/api"

const EXPIRETIME = 60 * 30 // 30 minutes

export class User {
  public username: string | undefined;
  public id: string | undefined;
  public displayName: string | undefined;

  static async initUsername(username: string): Promise<User | null> {
    const userObj = new User();
    userObj.username = username;
    const userid = await redis.get(`userlookup:${username}`);
    if (!userid) {
      const userdata = await chatterApi.users.getUserByName(username);
      if (!userdata) return null;
      userObj._setCache(userdata);
      userObj.id = userdata.id;
      userObj.displayName = userdata.displayName;
    } else {
      const displayname = await redis.get(`user:${userid}:displayName`);
      userObj._setExpire(userid, username);
      userObj.id = userid;
      userObj.displayName = displayname!;
    };
    return userObj;
  };

  static async initUserId(userId: string): Promise<User | null> {
    const userObj = new User();
    userObj.id = userId;
    if (!await redis.exists(`user:${userId}:displayName`)) {
      const userdata = await chatterApi.users.getUserById(userId);
      if (!userdata) return null;
      userObj._setCache(userdata);
      userObj.username = userdata.name;
      userObj.displayName = userdata.displayName;
    } else {
      const [displayName, username] = await Promise.all([
        redis.get(`user:${userId}:displayName`),
        redis.get(`user:${userId}:username`)
      ]);
      userObj._setExpire(userId, username!);
      userObj.username = username!;
      userObj.displayName = displayName!;
    };
    return userObj;
  };

  private async _setCache(userdata: HelixUser) {
    await Promise.all([
      redis.set(`user:${userdata.id}:displayName`, userdata.displayName),
      redis.set(`user:${userdata.id}:username`, userdata.name),
      redis.set(`userlookup:${userdata.name}`, userdata.id)
    ]);
    await this._setExpire(userdata.id, userdata.name);
  };

  private async _setExpire(userId: string, userName: string) {
    await Promise.all([
      redis.expire(`user:${userId}:displayName`, EXPIRETIME),
      redis.expire(`user:${userId}:username`, EXPIRETIME),
      redis.expire(`userlookup:${userName}`, EXPIRETIME)
    ]);
  };

  public async itemLock(): Promise<boolean> {
    const lock = await redis.get(`user:${this.id}:itemlock`);
    if (lock === '0') return false;
    return true;
  };

  public async setLock(): Promise<void> {
    await redis.set(`user:${this.id}:itemlock`, '1');
  };

  public async clearLock(): Promise<void> {
    await redis.set(`user:${this.id}:itemlock`, '0');
  };
};
