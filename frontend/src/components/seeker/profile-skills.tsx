import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { UserSkill, SkillLevel } from "@/lib/job-seeker-profile-types";

interface ProfileSkillsProps {
  skills: UserSkill[];
  onUpdate: (skills: UserSkill[]) => void;
}

const skillLevels: SkillLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

export default function ProfileSkills({ skills, onUpdate }: ProfileSkillsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "intermediate" as SkillLevel,
    yearsOfExperience: 1,
  });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skill: UserSkill = {
        id: `skill-${Date.now()}`,
        name: newSkill.name,
        level: newSkill.level,
        yearsOfExperience: newSkill.yearsOfExperience,
        endorsements: 0,
      };
      onUpdate([...skills, skill]);
      setNewSkill({
        name: "",
        level: "intermediate",
        yearsOfExperience: 1,
      });
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    onUpdate(skills.filter((skill) => skill.id !== skillId));
  };

  const getLevelLabel = (level: SkillLevel) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case "beginner":
        return "bg-blue-900/30 text-blue-100";
      case "intermediate":
        return "bg-amber-900/30 text-amber-100";
      case "advanced":
        return "bg-emerald-900/30 text-emerald-100";
      case "expert":
        return "bg-purple-900/30 text-purple-100";
    }
  };

  return (
    <div className="space-y-4">
      {/* Skills List */}
      <div className="space-y-2">
        {skills.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
            <p className="text-slate-400">
              No skills added yet. Add your first skill to get started!
            </p>
          </div>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-white">{skill.name}</h4>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getLevelColor(skill.level)}`}
                  >
                    {getLevelLabel(skill.level)}
                  </span>
                  {skill.endorsements > 0 && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      👍 {skill.endorsements} endorsement
                      {skill.endorsements !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {skill.yearsOfExperience} year
                  {skill.yearsOfExperience !== 1 ? "s" : ""} of experience
                </p>
              </div>
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Skill Form */}
      {isAdding ? (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. React, Node.js, TypeScript"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Proficiency Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill((prev) => ({
                    ...prev,
                    level: e.target.value as SkillLevel,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {getLevelLabel(level)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={newSkill.yearsOfExperience}
                onChange={(e) =>
                  setNewSkill((prev) => ({
                    ...prev,
                    yearsOfExperience: parseInt(e.target.value, 10),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddSkill}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Add Skill
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 rounded-lg bg-slate-700 px-3 py-2 font-medium text-white hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full rounded-lg border border-dashed border-slate-600 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
        >
          <Plus className="mb-1 inline-block" size={16} /> Add New Skill
        </button>
      )}

      {/* Helpful Tip */}
      <div className="rounded-lg bg-slate-800/30 px-4 py-3 text-sm text-slate-400">
        <p>
          💡 <strong>Tip:</strong> Keep your top 5-7 skills. Quality over
          quantity helps recruiters quickly understand your strengths.
        </p>
      </div>
    </div>
  );
}
