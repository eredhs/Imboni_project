import { SettingsModel } from "../models/settings.model.js";

export interface HRSettings {
  hrId: string;
  scoringWeights: {
    skills: number;
    experience: number;
    communication: number;
    cultureFit: number;
  };
  notificationPreferences: {
    emailOnApplication: boolean;
    emailOnScreeningComplete: boolean;
    emailOnShortlist: boolean;
    emailOnOffer: boolean;
    slackIntegration: boolean;
  };
  biasDetectionSettings: {
    enableRealTimeAlerts: boolean;
    educationUniformityGuard: boolean;
    experienceClustering: boolean;
  };
  shortlistDefaults: {
    shortlistSize: number; // 10 or 20
    autoRescreen: boolean;
  };
  teamSettings: {
    members: Array<{
      id: string;
      email: string;
      name: string;
      role: "admin" | "reviewer" | "viewer";
      joinedAt: string;
    }>;
  };
  integrations: {
    slack: { connected: boolean; webhookUrl?: string };
    zapier: { connected: boolean; apiKey?: string };
    airtable: { connected: boolean; baseId?: string };
  };
}

const settingsDB = new Map<string, HRSettings>();

// Default settings template
function createDefaultSettings(hrId: string): HRSettings {
  return {
    hrId,
    scoringWeights: {
      skills: 40,
      experience: 25,
      communication: 20,
      cultureFit: 15,
    },
    notificationPreferences: {
      emailOnApplication: true,
      emailOnScreeningComplete: true,
      emailOnShortlist: true,
      emailOnOffer: true,
      slackIntegration: false,
    },
    biasDetectionSettings: {
      enableRealTimeAlerts: true,
      educationUniformityGuard: true,
      experienceClustering: false,
    },
    shortlistDefaults: {
      shortlistSize: 10,
      autoRescreen: true,
    },
    teamSettings: {
      members: [],
    },
    integrations: {
      slack: { connected: false },
      zapier: { connected: false },
      airtable: { connected: false },
    },
  };
}

function mergeSettings(current: HRSettings, updates: Partial<HRSettings>): HRSettings {
  return {
    ...current,
    ...updates,
    scoringWeights: {
      ...current.scoringWeights,
      ...updates.scoringWeights,
    },
    notificationPreferences: {
      ...current.notificationPreferences,
      ...updates.notificationPreferences,
    },
    biasDetectionSettings: {
      ...current.biasDetectionSettings,
      ...updates.biasDetectionSettings,
    },
    shortlistDefaults: {
      ...current.shortlistDefaults,
      ...updates.shortlistDefaults,
    },
    teamSettings: {
      members: updates.teamSettings?.members ?? current.teamSettings.members,
    },
    integrations: {
      slack: {
        ...current.integrations.slack,
        ...updates.integrations?.slack,
      },
      zapier: {
        ...current.integrations.zapier,
        ...updates.integrations?.zapier,
      },
      airtable: {
        ...current.integrations.airtable,
        ...updates.integrations?.airtable,
      },
    },
  };
}

export async function getHRSettings(hrId: string): Promise<HRSettings> {
  let settings = await SettingsModel.findOne({ hrId }).lean<HRSettings | null>();

  if (!settings) {
    settings = createDefaultSettings(hrId);
    await SettingsModel.create(settings);
  }

  return settings;
}

export async function updateHRSettings(hrId: string, updates: Partial<HRSettings>): Promise<HRSettings> {
  const current = await getHRSettings(hrId);
  const updated = mergeSettings(current, updates);

  await SettingsModel.updateOne({ hrId }, { $set: updated }, { upsert: true });
  return updated;
}

export async function updateScoringWeights(
  hrId: string,
  weights: Partial<HRSettings["scoringWeights"]>
): Promise<HRSettings> {
  const current = await getHRSettings(hrId);
  return updateHRSettings(hrId, {
    ...current,
    scoringWeights: { ...current.scoringWeights, ...weights },
  });
}

export async function updateNotificationPreferences(
  hrId: string,
  prefs: Partial<HRSettings["notificationPreferences"]>
): Promise<HRSettings> {
  const current = await getHRSettings(hrId);
  return updateHRSettings(hrId, {
    ...current,
    notificationPreferences: { ...current.notificationPreferences, ...prefs },
  });
}

export async function addTeamMember(
  hrId: string,
  member: HRSettings["teamSettings"]["members"][0]
): Promise<HRSettings> {
  const current = await getHRSettings(hrId);
  return updateHRSettings(hrId, {
    ...current,
    teamSettings: {
      members: [...current.teamSettings.members, member],
    },
  });
}

export async function removeTeamMember(hrId: string, memberId: string): Promise<HRSettings> {
  const current = await getHRSettings(hrId);
  return updateHRSettings(hrId, {
    ...current,
    teamSettings: {
      members: current.teamSettings.members.filter((m) => m.id !== memberId),
    },
  });
}
