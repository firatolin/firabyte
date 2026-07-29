import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Schema.Types.ObjectId | string;
  authorId?: mongoose.Schema.Types.ObjectId | string; // For logged-in users
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  parentId?: mongoose.Schema.Types.ObjectId | string | null; // For threading
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post ID is required'],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
    },
    authorName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    authorEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    authorWebsite: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

export const Comment = models.Comment || model<IComment>('Comment', CommentSchema);