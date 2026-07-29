import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
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
CategorySchema.index({ slug: 1 });
CategorySchema.index({ name: 1 });

export const Category = models.Category || model<ICategory>('Category', CategorySchema);