import { redis } from "bun";
import { chatterApi } from "main";
import { HelixUser } from "@twurple/api"
import logger from "lib/logger";

const EXPIRETIME = 60 * 60 // 60 minutes

// The objective of this class is to:
// store displayname, username and id to reduce api calls
// keep track of temporary user specific flags (vulnerable to explosives, locked from using items)
//
// The userlookup key is used to find id's based on the username.
//
// The vulnchatters and userlookup look similar, but they're not the same
// userlookup expiration gets set when user chats or is targeted by another user
// vulnchatters only gets set when user chats

export default class User {
  public username!: string;
  public id!: string;
  public displayName!: string;

  static async initUsername(dirtyUsername: string): Promise<User | null> {
    try {
      const userObj = new User();
      const username = dirtyUsername.replaceAll(/@/gi, '');
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
    } catch {
      logger.err(`Failed to initialize user with name: ${dirtyUsername}`);
      return null;
    };
  };

  static async initUserId(userId: string): Promise<User | null> {
    try {
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
    } catch {
      logger.err(`Failed to initializer user with id: ${userId}`);
      return null;
    };
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
    return await redis.exists(`user:${this.id}:itemlock`);
  };

  public async setLock(): Promise<void> {
    await redis.set(`user:${this.id}:itemlock`, '1');
  };

  public async clearLock(): Promise<void> {
    await redis.del(`user:${this.id}:itemlock`);
  };

  public async setVulnerable(): Promise<void> {
    await redis.set(`user:${this.id}:vulnerable`, '1');
    await redis.expire(`user:${this.id}:vulnerable`, Math.floor(EXPIRETIME / 2)); // Vulnerable chatter gets removed from the pool after 30 minutes
  };

  public async clearVulnerable(): Promise<void> {
    await redis.del(`user:${this.id}:vulnerable`);
  };
};
