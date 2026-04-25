import React, { useState } from "react";
import { MapPin, Mail, Phone, User, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { UserProfile, AvailabilityStatus } from "@/lib/job-seeker-profile-types";

interface ProfileBasicInfoProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

export default function ProfileBasicInfo({
  profile,
  onUpdate,
}: ProfileBasicInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    headline: profile.headline,
    bio: profile.bio,
    availabilityStatus: profile.availabilityStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onUpdate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      headline: formData.headline,
      bio: formData.bio,
      availabilityStatus: formData.availabilityStatus as AvailabilityStatus,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      headline: profile.headline,
      bio: profile.bio,
      availabilityStatus: profile.availabilityStatus,
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20">
            <User size={48} className="text-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-lg text-emerald-400">{profile.headline}</p>
              <div className="mt-2 flex gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {profile.location}</span>
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-500" /> {profile.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-slate-500" /> {profile.phone}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-slate-300">{profile.bio}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Availability:</span>
              {profile.availabilityStatus === "actively_looking" && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={12} />
                  ACTIVELY LOOKING
                </span>
              )}
              {profile.availabilityStatus === "open_to_offers" && (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-900/30 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                  <Clock size={12} />
                  OPEN TO OFFERS
                </span>
              )}
              {profile.availabilityStatus === "not_looking" && (
                <span className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400 border border-slate-700">
                  <XCircle size={12} />
                  NOT LOOKING
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Professional Headline
        </label>
        <input
          type="text"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          placeholder="e.g. Full-Stack Developer | React | Node.js"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Professional Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about yourself, your experience, and career goals..."
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">
          Availability Status
        </label>
        <select
          name="availabilityStatus"
          value={formData.availabilityStatus}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-emerald-500 focus:outline-none"
        >
          <option value="actively_looking">
            🟢 Actively Looking for a new role
          </option>
          <option value="open_to_offers">
            🟡 Open to interesting opportunities
          </option>
          <option value="not_looking">
            🔴 Not looking, happy in current role
          </option>
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
