export class CronConstants {
    static DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: false
    }
    static DEBUG_SYNC_DATASET_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: global.IS_ENABLE_CRON
    }
}