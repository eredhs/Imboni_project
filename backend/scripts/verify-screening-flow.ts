import { applicationService } from "../src/services/application.service.ts";
import { getApplicantsByJob } from "../src/services/talent.service.ts";
import {
  getScreeningResults,
  getScreeningStatus,
  triggerScreening,
} from "../src/services/screening.service.ts";

async function waitForCompletion(runId: string, timeoutMs = 20000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const status = await getScreeningStatus(runId);
    if (status.status === "complete" || status.status === "failed") {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Timed out waiting for screening to finish");
}

async function main() {
  const jobId = "job-backend";
  const userId = "seeker-1";

  const application = await applicationService.createApplication(
    jobId,
    userId,
    "I have hands-on Node.js, MongoDB, and API delivery experience.",
    "https://example.com/resume/james-uwse.pdf",
  );

  const applicants = await getApplicantsByJob(jobId);
  const screeningRun = triggerScreening({
    jobId,
    weights: {
      skills: 40,
      experience: 25,
      communication: 20,
      culture: 15,
    },
    biasDetection: true,
    shortlistSize: 10,
  });

  const finalStatus = await waitForCompletion(screeningRun.runId);
  const results = await getScreeningResults(jobId);
  const applications = await applicationService.getApplicationsByUserId(userId);
  const notifications = await applicationService.getNotifications(userId);
  const updatedApplication = applications.find((item) => item.id === application.id) ?? null;

  console.log(
    JSON.stringify(
      {
        applicationCreated: Boolean(application?.id),
        applicantCountForJob: applicants.length,
        applicantLinkedToApplication: applicants.some(
          (item: any) =>
            item.applicationId === application.id && item.userId === userId,
        ),
        screeningStatus: finalStatus.status,
        screeningResultsCount: results?.items?.length ?? 0,
        applicationScreeningStatus: updatedApplication?.screeningStatus ?? null,
        applicationScreeningScore: updatedApplication?.screeningScore ?? null,
        applicationShortlisted: updatedApplication?.timeline?.some((event) => event.type === "shortlisted") ?? false,
        shortlistNotificationCreated: notifications.some((notification) => notification.type === "shortlisted"),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("[verify-screening-flow] failed", error?.message ?? error);
  process.exit(1);
});
