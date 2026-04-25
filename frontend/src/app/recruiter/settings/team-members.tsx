"use client";

import { useState } from "react";
import {
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
} from "@/store/api/settings-api";
import { Save, Trash2, Plus, Users } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

function TeamContent() {
  const { data: teamData } = useGetTeamMembersQuery();
  const [addMember] = useAddTeamMemberMutation();
  const [removeMember] = useRemoveTeamMemberMutation();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "reviewer" as "admin" | "reviewer" | "viewer",
  });
  const [adding, setAdding] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      alert("Please fill in all fields");
      return;
    }

    setAdding(true);
    try {
      await addMember(formData).unwrap();
      setFormData({ email: "", name: "", role: "reviewer" });
      alert("Team member added successfully!");
    } catch (error) {
      alert("Failed to add team member");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      try {
        await removeMember(memberId).unwrap();
        alert("Team member removed successfully!");
      } catch (error) {
        alert("Failed to remove team member");
      }
    }
  };

  const members = teamData?.data || [];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-900/30 text-red-300 border border-red-700/50";
      case "reviewer":
        return "bg-blue-900/30 text-blue-300 border border-blue-700/50";
      case "viewer":
        return "bg-slate-700/50 text-slate-300 border border-slate-600";
      default:
        return "bg-slate-700/50 text-slate-300 border border-slate-600";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Team Members</h2>
        <p className="text-slate-400">Invite team members and manage permissions</p>
      </div>

      {/* Add Member Form */}
      <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Plus size={20} />
          Invite Team Member
        </h3>
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
            />
            <input
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "admin" | "reviewer" | "viewer",
                })
              }
              className="px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-2 outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="reviewer">Reviewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus size={20} />
            {adding ? "Adding..." : "Add Member"}
          </button>
        </form>
      </div>

      {/* Team Members List */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={20} />
          Current Members ({members.length})
        </h3>
        {members.length === 0 ? (
          <p className="text-slate-400 py-8 text-center">No team members yet</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-slate-600/30 rounded-lg hover:bg-slate-600/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{member.name}</h4>
                  <p className="text-slate-400 text-sm">{member.email}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Joined{" "}
                    {new Date(member.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getRoleColor(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamMembersPage() {
  return (
    <SettingsLayout>
      <TeamContent />
    </SettingsLayout>
  );
}
