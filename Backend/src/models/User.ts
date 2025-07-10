/**
 * User Model
 * 
 * Extended user model that combines user authentication
 * with profile information for better query performance
 */

import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// User profile interface
interface IProfile {
  title?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills?: string[];
  hourlyRate?: number;
  category?: string;
  rating?: number;
  reviewCount?: number;
  completedProjects?: number;
  responseTime?: string;
  languages?: string[];
  portfolio?: string[];
}

// User document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'freelancer' | 'client' | 'both';
  profile?: IProfile;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema definition
const UserSchema = new Schema<IUser>(
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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['freelancer', 'client', 'both'],
      required: [true, 'Role is required'],
    },
    profile: {
      title: {
        type: String,
        maxlength: [100, 'Title cannot exceed 100 characters'],
      },
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
      },
      avatar: {
        type: String,
        default: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/default-avatar.png',
      },
      location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters'],
      },
      skills: [{
        type: String,
        maxlength: [50, 'Skill name cannot exceed 50 characters'],
      }],
      hourlyRate: {
        type: Number,
        min: [0, 'Hourly rate cannot be negative'],
      },
      category: {
        type: String,
        maxlength: [50, 'Category cannot exceed 50 characters'],
      },
      rating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: [0, 'Review count cannot be negative'],
      },
      completedProjects: {
        type: Number,
        default: 0,
        min: [0, 'Completed projects cannot be negative'],
      },
      responseTime: {
        type: String,
        maxlength: [50, 'Response time cannot exceed 50 characters'],
      },
      languages: [{
        type: String,
        maxlength: [50, 'Language name cannot exceed 50 characters'],
      }],
      portfolio: [{
        type: String,
      }],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'profile.category': 1 });
UserSchema.index({ 'profile.rating': -1 });
UserSchema.index({ 'profile.hourlyRate': 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Check if the model already exists before creating it
const User = mongoose.models.User || model<IUser>('User', UserSchema);

export default User;