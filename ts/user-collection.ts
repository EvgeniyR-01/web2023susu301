'use strict';

import {User} from './user';

class UserCollection implements Iterable<User> {
  private users: Array<User>;

  public constructor() {
    this.users = [];
  }

  [Symbol.iterator]() {
    return this.users[Symbol.iterator]();
  }

  get(index: number): User {
    return this.users[index];
  }

  set(index: number, value: User) {
    this.users[index] = value;
  }

  forEach(callback: (user: User) => void) {
    this.users.forEach(callback);
  }

  public get length(): number {
    return this.users.length;
  }

  public add(user: User): void {
    this.users.push(user);
  }

  public remove(user: User): void {
    const index: number = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  public find(user: User): User | undefined {
    return this.users.find((t) => Number(t.id) === Number(user.id));
  }

  public findById(taskId: number): User | undefined {
    return this.users.find((t) => Number(t.id) === Number(taskId));
  }

  public clear(): void {
    this.users.length = 0;
  }

  public toArray(): Array<User> {
    return this.users;
  }

  public toJSON(): Array<User> {
    return this.users;
  }
}

export default UserCollection;
export {UserCollection};
