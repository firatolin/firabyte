import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  email: string;
  password?: string; // Optional for Google OAuth users
  bio: string;
  avatar?: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  role: 'admin' | 'author' | 'contributor';
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters'],
      // Not required - Google OAuth users won't have a password
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['admin', 'author', 'contributor'],
      default: 'author',
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Author = models.Author || model<IAuthor>('Author', AuthorSchema);