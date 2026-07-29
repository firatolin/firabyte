import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // MDX content
  coverImage?: string;
  author: mongoose.Schema.Types.ObjectId | string; // Reference to Author
  tags: string[];
  category: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: Date;
  scheduledFor?: Date;
  readingTime: number; // In minutes
  viewCount: number;
  likes: number;
  comments: mongoose.Schema.Types.ObjectId[]; // References to Comment
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be lowercase alphanumeric with dashes',
      ],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
PostSchema.index({ slug: 1 });
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ author: 1 });

export const Post = models.Post || model<IPost>('Post', PostSchema);