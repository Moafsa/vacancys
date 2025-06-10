import { ProfileType } from '../enums/ProfileType';

export interface IUserProfile {
  id: string;
  userId: string;
  type: ProfileType;
  bio?: string;
  title?: string;
  company?: string;
  website?: string;
  location?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  skills?: string[];
  hourlyRate?: number;
  availability?: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfile implements IUserProfile {
  id: string;
  userId: string;
  type: ProfileType;
  bio?: string;
  title?: string;
  company?: string;
  website?: string;
  location?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  skills?: string[];
  hourlyRate?: number;
  availability?: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IUserProfile) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type;
    this.bio = data.bio;
    this.title = data.title;
    this.company = data.company;
    this.website = data.website;
    this.location = data.location;
    this.phone = data.phone;
    this.socialLinks = data.socialLinks;
    this.skills = data.skills;
    this.hourlyRate = data.hourlyRate;
    this.availability = data.availability;
    this.avatarUrl = data.avatarUrl;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  toJSON(): IUserProfile {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      bio: this.bio,
      title: this.title,
      company: this.company,
      website: this.website,
      location: this.location,
      phone: this.phone,
      socialLinks: this.socialLinks,
      skills: this.skills,
      hourlyRate: this.hourlyRate,
      availability: this.availability,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 