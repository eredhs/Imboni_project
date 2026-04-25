import React, { useState } from "react";
import { Trash2, Plus, Clock } from "lucide-react";
import type { UserExperience } from "@/lib/job-seeker-profile-types";

interface ProfileExperienceProps {
  experience: UserExperience[];
  onUpdate: (experience: UserExperience[]) => void;
}

export default function ProfileExperience({
  experience,
  onUpdate,
}: ProfileExperienceProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    skills: "",
  });

  const handleAddNew = () => {
    setFormData({
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      skills: "",
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (exp: UserExperience) => {
    setFormData({
      jobTitle: exp.jobTitle,
      company: exp.company,
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : "",
      isCurrent: exp.isCurrent,
      description: exp.description,
      skills: exp.skills.join(", "),
    });
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.jobTitle.trim() || !formData.company.trim()) {
      alert("Please fill in job title and company name");
      return;
    }

    if (editingId) {
      onUpdate(
        experience.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                jobTitle: formData.jobTitle,
                company: formData.company,
                startDate: new Date(formData.startDate),
                endDate: formData.isCurrent
                  ? undefined
                  : new Date(formData.endDate),
                isCurrent: formData.isCurrent,
                description: formData.description,
                skills: formData.skills
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : exp
        )
      );
    } else {
      const newExp: UserExperience = {
        id: `exp-${Date.now()}`,
        jobTitle: formData.jobTitle,
        company: formData.company,
        startDate: new Date(formData.startDate),
        endDate: formData.isCurrent ? undefined : new Date(formData.endDate),
        isCurrent: formData.isCurrent,
        description: formData.description,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      onUpdate([newExp, ...experience]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleRemove = (expId: string) => {
    onUpdate(experience.filter((exp) => exp.id !== expId));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  };

  const getDurationMonths = (start: Date, end?: Date) => {
    const endDate = end || new Date();
    const diffMs = endDate.getTime() - start.getTime();
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  if (isAdding) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
              }
              placeholder="e.g. Senior Developer"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
              placeholder="e.g. InnovateTech Rwanda"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, endDate: e.target.value }))
              }
              disabled={formData.isCurrent}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white disabled:opacity-50 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isCurrent}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isCurrent: e.target.checked }))
            }
            className="h-4 w-4"
          />
          <span className="text-sm text-slate-300">I currently work here</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Job Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            placeholder="Describe your responsibilities and achievements..."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Skills Used
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, skills: e.target.value }))
            }
            placeholder="e.g. React, Node.js, TypeScript (comma-separated)"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            {editingId ? "Update Experience" : "Add Experience"}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Experience List */}
      {experience.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
          <p className="text-slate-400">
            No work experience added yet. Start with your most recent role!
          </p>
        </div>
      ) : (
        experience.map((exp) => (
          <div
            key={exp.id}
            className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {exp.jobTitle}
                </h4>
                <p className="text-emerald-400">{exp.company}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={14} />
                  <span>
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isCurrent
                      ? "Present"
                      : exp.endDate
                      ? formatDate(exp.endDate)
                      : ""}
                  </span>
                  <span className="text-xs">
                    ({getDurationMonths(exp.startDate, exp.endDate)} months)
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-2 text-slate-300">{exp.description}</p>
                )}
                {exp.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="rounded-lg bg-slate-700 px-3 py-1 text-sm font-medium text-white hover:bg-slate-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(exp.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add Button */}
      <button
        onClick={handleAddNew}
        className="w-full rounded-lg border border-dashed border-slate-600 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
      >
        <Plus className="mb-1 inline-block" size={16} /> Add Work Experience
      </button>
    </div>
  );
}
