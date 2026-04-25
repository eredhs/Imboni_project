"use client";

import { Check, CreditCard } from "lucide-react";
import SettingsLayout from "@/components/recruiter/settings-layout";

function BillingContent() {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$299",
      period: "/month",
      description: "Perfect for small teams",
      features: [
        "Up to 5 job postings",
        "Unlimited applications",
        "Basic AI screening",
        "Email support",
      ],
      current: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: "$699",
      period: "/month",
      description: "For growing companies",
      features: [
        "Unlimited job postings",
        "Unlimited applications",
        "Advanced AI screening with bias detection",
        "Team members access (up to 5)",
        "Integrations support",
        "Priority email support",
      ],
      current: true,
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Custom screening workflows",
        "Dedicated account manager",
        "API access",
        "24/7 phone support",
        "Custom integrations",
      ],
      current: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Plans</h2>
        <p className="text-slate-400">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
            <p className="text-blue-200 mt-1">Professional Plan - $699/month</p>
            <p className="text-blue-300 text-sm mt-3">
              Renews on April 14, 2026 • Next billing: $699.00
            </p>
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Change Plan
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-slate-700/50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard size={20} />
          Payment Method
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300">Visa ending in 4242</p>
            <p className="text-slate-500 text-sm mt-1">Expires 12/2025</p>
          </div>
          <button className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors">
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Available Plans */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border transition-all ${
                plan.highlighted
                  ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-600/50 ring-2 ring-indigo-500/30"
                  : "bg-slate-700/50 border-slate-600"
              } p-6 relative`}
            >
              {plan.current && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-xs font-semibold rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <h4 className="text-xl font-bold text-white mt-4">{plan.name}</h4>
              <p className="text-slate-400 text-sm mt-1">{plan.description}</p>

              <div className="mt-4 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.current}
                className={`w-full py-2 font-semibold rounded-lg transition-colors ${
                  plan.current
                    ? "bg-slate-600/50 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
        <div className="space-y-2">
          {[
            { date: "Mar 14, 2026", amount: "$699.00", status: "Paid" },
            { date: "Feb 14, 2026", amount: "$699.00", status: "Paid" },
            { date: "Jan 14, 2026", amount: "$699.00", status: "Paid" },
          ].map((invoice, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-slate-600/50 last:border-b-0"
            >
              <div>
                <p className="text-white font-medium">{invoice.date}</p>
                <span className="text-emerald-400 text-sm">{invoice.status}</span>
              </div>
              <button className="px-4 py-1 text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <SettingsLayout>
      <BillingContent />
    </SettingsLayout>
  );
}
