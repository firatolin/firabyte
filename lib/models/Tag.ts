import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Tag name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Tag slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
TagSchema.index({ slug: 1 });
TagSchema.index({ name: 1 });

export const Tag = models.Tag || model<ITag>('Tag', TagSchema);