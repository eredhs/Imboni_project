import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { UserEducation } from "@/lib/job-seeker-profile-types";

interface ProfileEducationProps {
  education: UserEducation[];
  onUpdate: (education: UserEducation[]) => void;
}

const degreeTypes = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Certificate",
  "Diploma",
  "Other",
];

export default function ProfileEducation({
  education,
  onUpdate,
}: ProfileEducationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: "",
    degree: "Bachelor's Degree",
    fieldOfStudy: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    description: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleAddNew = () => {
    setFormData({
      institution: "",
      degree: "Bachelor's Degree",
      fieldOfStudy: "",
      startYear: currentYear,
      endYear: currentYear,
      description: "",
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleEdit = (edu: UserEducation) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startYear: edu.startYear,
      endYear: edu.endYear,
      description: edu.description ?? "",
    });
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!formData.institution.trim() || !formData.fieldOfStudy.trim()) {
      alert("Please fill in institution and field of study");
      return;
    }

    if (formData.startYear > formData.endYear) {
      alert("Start year must be before end year");
      return;
    }

    if (editingId) {
      onUpdate(
        education.map((edu) =>
          edu.id === editingId
            ? {
                ...edu,
                institution: formData.institution,
                degree: formData.degree,
                fieldOfStudy: formData.fieldOfStudy,
                startYear: formData.startYear,
                endYear: formData.endYear,
                description: formData.description,
              }
            : edu
        )
      );
    } else {
      const newEdu: UserEducation = {
        id: `edu-${Date.now()}`,
        institution: formData.institution,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        startYear: formData.startYear,
        endYear: formData.endYear,
        description: formData.description,
      };
      onUpdate([newEdu, ...education]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleRemove = (eduId: string) => {
    onUpdate(education.filter((edu) => edu.id !== eduId));
  };

  if (isAdding) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                institution: e.target.value,
              }))
            }
            placeholder="e.g. University of Rwanda"
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Degree Type
            </label>
            <select
              value={formData.degree}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  degree: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              {degreeTypes.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Field of Study *
            </label>
            <input
              type="text"
              value={formData.fieldOfStudy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fieldOfStudy: e.target.value,
                }))
              }
              placeholder="e.g. Computer Science"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Start Year
            </label>
            <select
              value={formData.startYear}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startYear: parseInt(e.target.value, 10),
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              End Year
            </label>
            <select
              value={formData.endYear}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endYear: parseInt(e.target.value, 10),
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Additional Details
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="e.g. Graduated with honors. Relevant coursework: AI, Web Development, Database Design."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            {editingId ? "Update Education" : "Add Education"}
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
      {/* Education List */}
      {education.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
          <p className="text-slate-400">
            No education added yet. Add your qualifications!
          </p>
        </div>
      ) : (
        education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">
                  {edu.degree} in {edu.fieldOfStudy}
                </h4>
                <p className="text-emerald-400">{edu.institution}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {edu.startYear} – {edu.endYear}
                </p>
                {edu.description && (
                  <p className="mt-2 text-slate-300">{edu.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="rounded-lg bg-slate-700 px-3 py-1 text-sm font-medium text-white hover:bg-slate-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(edu.id)}
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
        <Plus className="mb-1 inline-block" size={16} /> Add Education
      </button>
    </div>
  );
}
