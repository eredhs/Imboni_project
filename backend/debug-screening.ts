import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/api";

// Test credentials
const TEST_USER = {
  email: "recruiter@test.com",
  password: "password123",
};

let authToken = "";

async function login() {
  console.log("\n=== STEP 1: LOGIN ===");
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });

    const data = (await response.json()) as any;
    authToken = data.accessToken;
    console.log("✓ Login successful");
    console.log("Token:", authToken?.slice(0, 20) + "...");
    return true;
  } catch (error) {
    console.error("✗ Login failed:", error);
    return false;
  }
}

async function getJobs() {
  console.log("\n=== STEP 2: GET JOBS ===");
  try {
    const response = await fetch(`${BASE_URL}/jobs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = (await response.json()) as any;
    console.log(`✓ Found ${data.items?.length ?? 0} jobs`);
    
    const jobWithApplicants = data.items?.find((job: any) => job.applicantCount > 0);
    if (!jobWithApplicants) {
      console.log("✗ No jobs with applicants found");
      return null;
    }
    
    console.log(`✓ Selected job: ${jobWithApplicants.id} (${jobWithApplicants.title})`);
    console.log(`✓ Applicant count: ${jobWithApplicants.applicantCount}`);
    return jobWithApplicants;
  } catch (error) {
    console.error("✗ Get jobs failed:", error);
    return null;
  }
}

async function getApplicants(jobId: string) {
  console.log("\n=== STEP 3: GET APPLICANTS ===");
  try {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}/applicants`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = (await response.json()) as any;
    console.log(`✓ Found ${data.items?.length ?? 0} applicants`);
    
    data.items?.slice(0, 2).forEach((applicant: any, i: number) => {
      console.log(`  - Applicant ${i + 1}: ${applicant.fullName} (${applicant.skills?.join(", ")})`);
    });
    
    return data.items?.length ?? 0;
  } catch (error) {
    console.error("✗ Get applicants failed:", error);
    return 0;
  }
}

async function triggerScreening(jobId: string) {
  console.log("\n=== STEP 4: TRIGGER SCREENING ===");
  const payload = {
    jobId,
    weights: { skills: 40, experience: 25, communication: 20, culture: 15 },
    biasDetection: true,
    shortlistSize: 10,
  };

  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}/screening/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as any;
    console.log("✓ Screening triggered");
    console.log("Response:", JSON.stringify(data, null, 2));
    
    return data.runId;
  } catch (error) {
    console.error("✗ Trigger screening failed:", error);
    return null;
  }
}

async function pollScreeningStatus(jobId: string, runId: string) {
  console.log("\n=== STEP 5: POLL SCREENING STATUS ===");
  console.log(`Polling status every 1 second for 20 seconds...`);

  for (let i = 0; i < 20; i++) {
    try {
      const response = await fetch(
        `${BASE_URL}/jobs/${jobId}/screening/status?runId=${runId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const data = (await response.json()) as any;
      console.log(
        `[${i + 1}/20] Status: ${data.status} | Progress: ${data.progress}% | Message: ${data.message}`
      );

      if (data.status === "complete") {
        console.log("✓ Screening completed!");
        return;
      }

      if (data.status === "failed") {
        console.log("✗ Screening failed!");
        return;
      }

      // Wait 1 second before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("✗ Poll failed:", error);
      return;
    }
  }

  console.log("✗ Polling timed out (20 seconds)");
}

async function getScreeningResults(jobId: string) {
  console.log("\n=== STEP 6: GET SCREENING RESULTS ===");
  try {
    const response = await fetch(`${BASE_URL}/jobs/${jobId}/screening/results`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = (await response.json()) as any;
    console.log(`✓ Found ${data.items?.length ?? 0} shortlisted candidates`);
    
    data.items?.slice(0, 3).forEach((candidate: any, i: number) => {
      console.log(
        `  - ${i + 1}. ${candidate.fullName} (Score: ${candidate.score}, Confidence: ${candidate.confidence})`
      );
    });
    
    console.log(`Bias Alert: ${data.biasAlert?.detected ? "YES - " + data.biasAlert.message : "NO"}`);
  } catch (error) {
    console.error("✗ Get results failed:", error);
  }
}

async function main() {
  console.log("🚀 Starting Screening Debug Flow...\n");

  const loggedIn = await login();
  if (!loggedIn) return;

  const job = await getJobs();
  if (!job) return;

  await getApplicants(job.id);

  const runId = await triggerScreening(job.id);
  if (!runId) return;

  await pollScreeningStatus(job.id, runId);

  await getScreeningResults(job.id);

  console.log("\n✅ Debug flow completed");
}

main().catch(console.error);
