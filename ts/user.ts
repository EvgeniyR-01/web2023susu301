'use strict';

class Address {
  public street: string;
  public suite: string;
  public city: string;
  public zipcode: string;
  public geo: Geo | null | undefined;

  public constructor(street: string, suite: string, city: string, zipcode: string, geo: Geo | null | undefined) {
    this.street = street;
    this.suite = suite;
    this.city = city;
    this.zipcode = zipcode;
    this.geo = geo;
  }

  public toObject(): object {
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
  public lat: number;
  public lng: number;

  public constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  public toObject(): object {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }
}

class Company {
  public name: string;
  public catchPhrase: string;
  public bg: string;

  public constructor(name: string, catchPhrase: string, bg: string) {
    this.name = name;
    this.catchPhrase = catchPhrase;
    this.bg = bg;
  }

  public toObject(): object {
    return {
      name: this.name,
      catchPhrase: this.catchPhrase,
      bg: this.bg,
    };
  }
}

class User {
  public id: number;
  public name: string;
  public username: string;
  public email: string;
  public address: Address | null | undefined;
  public phone: string;
  public website: string;
  public company: Company | null | undefined;

  public constructor(id: number, name: string, username: string, email: string, address: Address | null | undefined, phone: string, website: string, company: Company | null | undefined) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.company = company;
  }

  public toObject(): object {
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

  public static fromObject(obj: object): User {
    const geo = obj['address']['geo'] ? new Geo(obj['address']['geo']['lat'], obj['address']['geo']['lng']) : null;
    const address = obj['address'] ? new Address(obj['address']['street'], obj['address']['suite'], obj['address']['city'], obj['address']['zipcode'], geo) : null;
    const company = obj['company'] ? new Company(obj['company']['name'], obj['company']['catchPhrase'], obj['company']['bg']) : null;

    return new User(obj['id'], obj['name'], obj['username'], obj['email'], address, obj['phone'], obj['website'], company);
  }

  public toJSON(): object {
    return this.toObject();
  }
}

export default User;
export {User};
