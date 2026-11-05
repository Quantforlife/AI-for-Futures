// Public settings only. Never put secrets here.
const APP_CONFIG = {
  formProvider: "google_apps_script", // google_apps_script | formspree | hubspot | airtable (all just POST JSON to endpoint)
  endpoint: "",                       // paste your deployed web-app URL to go live
  enableDemoMode: true                // when endpoint is empty, run clearly labelled demo
};
