"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
}

export function ApiKeysManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch API keys
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-keys", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("talentlens_access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const data = await response.json();
      setApiKeys(data.data || []);
    } catch (error) {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("talentlens_access_token")}`,
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) throw new Error("Failed to generate API key");

      const data = await response.json();
      setGeneratedKey(data.data.key);
      setNewKeyName("");
      toast.success(data.message);
      
      // Refresh list
      await fetchApiKeys();
    } catch (error) {
      toast.error("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key?")) return;

    try {
      const response = await fetch(`/api/api-keys/${keyId}/revoke`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("talentlens_access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to revoke API key");

      toast.success("API key revoked");
      await fetchApiKeys();
    } catch (error) {
      toast.error("Failed to revoke API key");
    }
  };

  const deleteKey = async (keyId: string) => {
    if (!confirm("Permanently delete this API key?")) return;

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("talentlens_access_token")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete API key");

      toast.success("API key deleted");
      await fetchApiKeys();
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Generate New API Key</h3>
            <input
              type="text"
              placeholder="Key name (e.g., 'Integration 1')"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#312E81]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNewKeyModal(false);
                  setNewKeyName("");
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={generateNewKey}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-[#312E81] text-white rounded-lg hover:bg-[#4338CA] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Key Display */}
      {generatedKey && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h4 className="font-bold text-emerald-900 mb-2">✅ API Key Generated</h4>
          <p className="text-sm text-emerald-700 mb-4">
            Save your API key now. You won't be able to see it again!
          </p>
          <div className="flex items-center gap-2 bg-white border border-emerald-300 rounded-lg p-3">
            <code className="flex-1 font-mono text-sm break-all">
              {showKey ? generatedKey : "••••••••••••••••••••••••••••••••"}
            </code>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1 hover:bg-gray-100 rounded"
              title={showKey ? "Hide" : "Show"}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={() => copyToClipboard(generatedKey)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy"
            >
              <Copy size={18} />
            </button>
          </div>
          <button
            onClick={() => setGeneratedKey(null)}
            className="mt-4 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Done
          </button>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Permanent API Keys</h2>
            <p className="text-sm text-gray-500 mt-1">
              Use these keys to access the API from external applications across different PCs
            </p>
          </div>
          <button
            onClick={() => setShowNewKeyModal(true)}
            className="bg-[#312E81] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#4338CA] transition-all"
          >
            <Plus size={18} />
            Generate Key
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No API keys yet. Generate one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{key.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        Prefix: {key.prefix}...
                      </p>
                    </div>
                    {!key.isActive && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-semibold">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Created: {new Date(key.createdAt).toLocaleDateString()}
                    {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  {key.isActive && (
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 font-semibold"
                      title="Revoke this key"
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
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
