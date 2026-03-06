export function formatJobMessage(job: any) {

  const closeDate = new Date(JSON.parse(job.closeAt)).toLocaleDateString();

  return `
Greetings from CCD, NIT Agartala!

A new opportunity has been posted on the Career Portal for interested students.

*Position Details:*
* Title: ${job.title}
* Role: ${job.role}
* Employment Type: ${job.employmentType ?? "Not specified"}

*Job Description:*
${job.description ?? "No description provided."}

*Application Deadline:* ${closeDate}

Students who meet the eligibility criteria are encouraged to apply before the deadline.

For further updates, please stay connected with the CCD placement notifications.

Best regards,
Career Development Cell (CCD)
NIT Agartala
`.trim();

}