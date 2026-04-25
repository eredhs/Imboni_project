import React, { useState } from "react";
import { Trash2, Plus, ExternalLink } from "lucide-react";

interface PortfolioLink {
  title: string;
  url: string;
}

interface ProfilePortfolioProps {
  portfolioLinks: PortfolioLink[];
  onUpdate: (links: PortfolioLink[]) => void;
}

export default function ProfilePortfolio({
  portfolioLinks,
  onUpdate,
}: ProfilePortfolioProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });

  const handleAddLink = () => {
    if (formData.title.trim() && formData.url.trim()) {
      // Ensure URL has protocol
      let url = formData.url.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      onUpdate([
        ...portfolioLinks,
        {
          title: formData.title,
          url,
        },
      ]);
      setFormData({ title: "", url: "" });
      setIsAdding(false);
    }
  };

  const handleRemoveLink = (index: number) => {
    onUpdate(portfolioLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Links List */}
      <div className="space-y-2">
        {portfolioLinks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center">
            <p className="text-slate-400">
              No portfolio links added yet. Share your GitHub, website, or
              project links!
            </p>
          </div>
        ) : (
          portfolioLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white">{link.title}</h4>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 truncate text-sm text-emerald-400 hover:text-emerald-300"
                >
                  {link.url}
                  <ExternalLink size={14} />
                </a>
              </div>
              <button
                onClick={() => handleRemoveLink(index)}
                className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Link Form */}
      {isAdding ? (
        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Link Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g. GitHub, Personal Website, Portfolio"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="e.g. github.com/yourname or yoursite.com"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddLink}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-700"
            >
              Add Link
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setFormData({ title: "", url: "" });
              }}
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
          <Plus className="mb-1 inline-block" size={16} /> Add Portfolio Link
        </button>
      )}

      {/* Helpful Tips */}
      <div className="rounded-lg bg-slate-800/30 px-4 py-3 text-sm text-slate-400">
        <p className="font-medium">💡 Portfolio Link Tips:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          <li>GitHub: Showcase your code and projects</li>
          <li>Personal Website: About you and your work</li>
          <li>Behance/Dribbble: If you're a designer</li>
          <li>Medium/Dev.to: Technical blog posts</li>
        </ul>
      </div>
    </div>
  );
}
