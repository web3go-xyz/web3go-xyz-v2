import { AppConfig } from "./base/setting/appConfig"

export class CronConstants {
    static DEBUG_SYNC_DASHBOARD_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: AppConfig.IS_ENABLE_CRON
    }
    static DEBUG_SYNC_DATASET_FROM_MB_INTERVAL = {
        namee: '',
        cron: '0 */2 * * * *',
        enabled: AppConfig.IS_ENABLE_CRON
    }
}