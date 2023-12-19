'use strict';
class Address {
  constructor(street, suite, city, zipcode, geo) {
    this.street = street;
    this.suite = suite;
    this.city = city;
    this.zipcode = zipcode;
    this.geo = geo;
  }
  toObject() {
    return {
      street: this.street,
      suite: this.suite,
      city: this.city,
      zipcode: this.zipcode,
      geo: this.geo.toObject(),
    };
  }
}
class Geo {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
  toObject() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}
class Company {
  constructor(name, catchPhrase, bg) {
    this.name = name;
    this.catchPhrase = catchPhrase;
    this.bg = bg;
  }
  toObject() {
    return {
      name: this.name,
      catchPhrase: this.catchPhrase,
      bg: this.bg,
    };
  }
}
class User {
  constructor(id, name, username, email, address, phone, website, company) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.company = company;
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      address: this.address.toObject(),
      phone: this.phone,
      website: this.website,
      company: this.company.toObject(),
    };
  }
  static fromObject(obj) {
    const geo = obj['address']['geo'] ? new Geo(obj['address']['geo']['lat'], obj['address']['geo']['lng']) : null;
    const address = obj['address'] ? new Address(obj['address']['street'], obj['address']['suite'], obj['address']['city'], obj['address']['zipcode'], geo) : null;
    const company = obj['company'] ? new Company(obj['company']['name'], obj['company']['catchPhrase'], obj['company']['bg']) : null;
    return new User(obj['id'], obj['name'], obj['username'], obj['email'], address, obj['phone'], obj['website'], company);
  }
  toJSON() {
    return this.toObject();
  }
}
export default User;
export {User};
