import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      required: true,
    },
    pic: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
      required: false,
    },
    timeZone: {
      type: String,
      default: 'International Date Line West',
      required: false,
    },
    website: { type: String, default: 'https://casasoft.mt' },
    communication: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      phone: { type: Boolean, default: false },
    },
    address: {
      addressLine: { type: String, default: 'L-12-20 Vertex, Cybersquare' },
      city: { type: String, default: 'San Francisco' },
      state: { type: String, default: 'California' },
      postCode: { type: String, default: '45000' },
    },
    socialNetworks: {
      linkedIn: { type: String, default: 'https://linkedin.com/admin' },
      facebook: { type: String, default: 'https://facebook.com/admin' },
      twitter: { type: String, default: 'https://twitter.com/admin' },
      instagram: { type: String, default: 'https://instagram.com/admin' },
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);

export default mongoose.model('users', UserSchema);
