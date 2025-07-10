/**
 * Job Model
 * 
 * Represents job postings created by clients
 */

import { Schema, model, Document } from "mongoose";

// Job client interface
interface IJobClient {
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  memberSince: Date;
  verified: boolean;
}

// Job document interface
export interface IJob extends Document {
  title: string;
  description: string;
  budget: number;
  duration: string;
  category: string;
  skills: string[];
  experienceLevel: 'Entry' | 'Intermediate' | 'Expert';
  projectType: 'Fixed Price' | 'Hourly';
  hourlyRate?: number;
  attachments: string[];
  proposals: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  visibility: 'public' | 'private';
  client: IJobClient;
  image?: string; // Featured image for the job
  postedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Job schema definition
const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      maxlength: [100, 'Duration cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    skills: [{
      type: String,
      maxlength: [50, 'Skill name cannot exceed 50 characters'],
    }],
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Intermediate', 'Expert'],
      required: [true, 'Experience level is required'],
    },
    projectType: {
      type: String,
      enum: ['Fixed Price', 'Hourly'],
      required: [true, 'Project type is required'],
    },
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative'],
    },
    attachments: [{
      type: String,
    }],
    proposals: {
      type: Number,
      default: 0,
      min: [0, 'Proposals count cannot be negative'],
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled'],
      default: 'open',
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    client: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/default-avatar.png',
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      location: {
        type: String,
      },
      memberSince: {
        type: Date,
        default: Date.now,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    image: {
      type: String,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
JobSchema.index({ category: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ 'client.name': 1 });
JobSchema.index({ postedDate: -1 });
JobSchema.index({ title: 'text', description: 'text' }); // Text search index

const Job = model<IJob>('Job', JobSchema);

export default Job;