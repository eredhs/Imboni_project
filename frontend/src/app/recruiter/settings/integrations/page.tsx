"use client";

import { Slack, Zap, Grid } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

function IntegrationsContent() {
  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications in Slack when candidates are shortlisted or offers are made",
      icon: Slack,
      connected: false,
      cta: "Connect Slack",
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automate workflows and connect IMBONI with 1000+ other apps",
      icon: Zap,
      connected: false,
      cta: "Configure Zapier",
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Sync hiring data with your Airtable bases for custom reporting",
      icon: Grid,
      connected: false,
      cta: "Connect Airtable",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
        <p className="text-slate-400">Connect IMBONI with your favorite tools</p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="bg-slate-700/50 rounded-lg p-6 flex items-start justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-slate-600/50 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{integration.description}</p>
                  <div className="mt-3">
                    {integration.connected ? (
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm font-semibold rounded-full">
                        ✓ Connected
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm font-semibold rounded-full">
                        Not Connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                {integration.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <SettingsLayout>
      <IntegrationsContent />
    </SettingsLayout>
  );
}
