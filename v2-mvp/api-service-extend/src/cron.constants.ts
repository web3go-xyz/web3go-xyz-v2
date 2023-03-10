let IS_ENABLE_CRON = true;
if (process.env.TERM_PROGRAM === "vscode") { // turn off when it starts with Visual Studio Code
    IS_ENABLE_CRON = false;
  } else if (typeof process.env.IS_ENABLE_CRON === 'undefined') {
    IS_ENABLE_CRON = true;
  } else {
    IS_ENABLE_CRON = process.env.IS_ENABLE_CRON === 'true';
  }
export class CronConstants {
    static DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: IS_ENABLE_CRON
    }
    static DEBUG_SYNC_DATASET_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: IS_ENABLE_CRON
    }
}