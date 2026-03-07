export function formatJobMessage(job: any) {
  const closeAtValue = job?.closeAt;
  const closeDate = closeAtValue
    ? new Date(closeAtValue).toLocaleDateString()
    : "Not specified";
  const companyName = job?.company?.name ?? "Not specified";
  const departmentName = job?.department?.name ?? "Not specified";
  const location = job?.location ?? "Not specified";

  const studentAppBaseUrl = process.env.STUDENT_APP_BASE_URL ?? "http://localhost:3000";
  const applyLink = job?.id ? `${studentAppBaseUrl.replace(/\/$/, "")}/apply/${job.id}` : null;

  return `
Greetings from CCD, NIT Agartala!

A new opportunity has been posted on the Career Portal for interested students.

*Position Details:*
* Title: ${job.title}
* Role: ${job.role}
* Company: ${companyName}
* Department: ${departmentName}
* Employment Type: ${job.employmentType ?? "Not specified"}
* Location: ${location}

*Job Description:*
${job.description ?? "No description provided."}

*Application Deadline:* ${closeDate}
${applyLink ? `\n*Apply Here:* ${applyLink}` : ""}

Students who meet the eligibility criteria are encouraged to apply before the deadline.

For further updates, please stay connected with the CCD placement notifications.

Best regards,
Career Development Cell (CCD)
NIT Agartala
`.trim();

}
