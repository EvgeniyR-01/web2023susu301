'use strict';
class UserCollection {
  constructor() {
    this.users = [];
  }
  [Symbol.iterator]() {
    return this.users[Symbol.iterator]();
  }
  get(index) {
    return this.users[index];
  }
  set(index, value) {
    this.users[index] = value;
  }
  forEach(callback) {
    this.users.forEach(callback);
  }
  get length() {
    return this.users.length;
  }
  add(user) {
    this.users.push(user);
  }
  remove(user) {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
  find(user) {
    return this.users.find((t) => Number(t.id) === Number(user.id));
  }
  findById(taskId) {
    return this.users.find((t) => Number(t.id) === Number(taskId));
  }
  clear() {
    this.users.length = 0;
  }
  toArray() {
    return this.users;
  }
  toJSON() {
    return this.users;
  }
}
export default UserCollection;
export {UserCollection};
