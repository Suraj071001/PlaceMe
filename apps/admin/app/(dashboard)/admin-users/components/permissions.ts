export const getDefaultPermissions = (role: string): Record<string, boolean> => {
  const isDirector = role === "Director";
  const isPH = role === "Placement Head" || isDirector;
  const isFC = role === "Faculty Coordinator" || isPH;
  const isIC = role === "IC" || isPH;
  const isPC = role === "PC" || isPH;

  return {
    view_global: isDirector,
    edit_platform: isDirector,
    edit_policies: isDirector,
    approve_final: isDirector,
    view_reports: isPH,
    edit_schedules: isPH,
    edit_jobs: isPH,
    manage_fc: isPH,
    view_dept: isFC,
    verify_profiles: isFC,
    edit_records: isFC,
    manage_insights: isFC,
    view_intern_co: isIC,
    view_intern_apps: isIC,
    view_resumes_ic: isIC,
    view_interviews_ic: isIC,
    view_place_co: isPC,
    view_job_posts: isPC,
    view_place_status: isPC,
    view_results: isPC,
  };
};
