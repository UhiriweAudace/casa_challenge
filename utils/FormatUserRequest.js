import faker from 'faker';
import bcrypt from 'bcrypt';
import { AppConfig } from '../config/index.js';

export const FormatUserRequest = async data => {
  const values = new Object(data);

  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  const userData = {
    firstname,
    lastname,
    username: faker.name.firstName(),
    roles: [1], // Administrator
    pic: faker.image.avatar(),
    fullname: `${lastname} ${firstname}`,
    occupation: 'CEO',
    companyName: 'CasaSoft',
    phone: faker.phone.phoneNumber(),
    language: 'en',
    timeZone: 'International Date Line West',
    website: 'https://casasoft.mt',
    communication: {
      email: true,
      sms: true,
      phone: false,
    },
    address: {
      addressLine: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      postCode: faker.address.zipCode(),
    },
    socialNetworks: {
      linkedIn: 'https://linkedin.com/admin',
      facebook: 'https://facebook.com/admin',
      twitter: 'https://twitter.com/admin',
      instagram: 'https://instagram.com/admin',
    },
  };

  const hashedPassword = await bcrypt.hash(values.password, AppConfig.saltOrRounds);
  return Object.assign(values, { ...userData, password: hashedPassword });
};

export const emailSettings = {
  emailNotification: true,
  sendCopyToPersonalEmail: false,
  activityRelatesEmail: {
    youHaveNewNotifications: false,
    youAreSentADirectMessage: false,
    someoneAddsYouAsAsAConnection: true,
    uponNewOrder: false,
    newMembershipApproval: false,
    memberRegistration: true,
  },
  updatesFromKeenthemes: {
    newsAboutKeenthemesProductsAndFeatureUpdates: false,
    tipsOnGettingMoreOutOfKeen: false,
    thingsYouMissedSindeYouLastLoggedIntoKeen: true,
    newsAboutMetronicOnPartnerProductsAndOtherServices: true,
    tipsOnMetronicBusinessProducts: true,
  },
};
