import { W3Logger } from "src/base/log/logger.service";
import { OnEvent } from '@nestjs/event-emitter'
import { OperationEventPayload } from "./model/OperationEventPayload";
import { OperationEventTopic } from "./model/OperationEventTopic";
import { Inject } from "@nestjs/common";
import { DashboardExt } from "src/base/entity/platform-dashboard/DashboardExt";
import { DashboardFavoriteLog } from "src/base/entity/platform-dashboard/DashboardFavoriteLog";
import { DashboardForkLog } from "src/base/entity/platform-dashboard/DashboardForkLog";
import { DashboardShareLog } from "src/base/entity/platform-dashboard/DashboardShareLog";
import { DashboardViewLog } from "src/base/entity/platform-dashboard/DashboardViewLog";
import { RepositoryConsts } from "src/base/orm/repositoryConsts";
import { Repository } from "typeorm";
import { EventEmitter2 } from '@nestjs/event-emitter'

export class EventService {

    logger: W3Logger;
    constructor(
        private eventEmitter: EventEmitter2,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_EXT_REPOSITORY.provide)
        private dextRepo: Repository<DashboardExt>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FAVORITE_LOG_REPOSITORY.provide)
        private dfavlRepo: Repository<DashboardFavoriteLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_FORK_LOG_REPOSITORY.provide)
        private dforklRepo: Repository<DashboardForkLog>,
        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_SHARE_LOG_REPOSITORY.provide)
        private dsharelRepo: Repository<DashboardShareLog>,

        @Inject(RepositoryConsts.REPOSITORYS_PLATFORM.PLATFORM_DASHBOARD_VIEW_LOG_REPOSITORY.provide)
        private dviewlRepo: Repository<DashboardViewLog>,

    ) {
        this.logger = new W3Logger(`EventService`);
    }

    fireEvent(payload: OperationEventPayload) {
        this.logger.debug(`fireEvent:${JSON.stringify(payload)}`);
        //emit events
        this.eventEmitter.emit(
            payload.topic.toString(),
            payload
        );
    }

    // @OnEvent('**', { async: true })
    // handleAllEvents(payload: OperationEventPayload) {
    //     // handle and process an event
    //     this.logger.debug(`handleAllEvents:${JSON.stringify(payload)}`);
    // }

    @OnEvent('dashboard.*', { async: true })
    async handleDashboardEvents(payload: OperationEventPayload) {
        // handle and process an event
        this.logger.debug(`handleDashboardEvents:${JSON.stringify(payload)}`);
        switch (payload.topic) {
            case OperationEventTopic.logViewDashboard:

                let viewCount = await this.dviewlRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { viewCount: viewCount });

                break;
            case OperationEventTopic.logShareDashboard:
                let shareCount = await this.dsharelRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { shareCount: shareCount });

                break;
            case OperationEventTopic.logForkDashboard:
                let forkCount = await this.dforklRepo.count({
                    where: { originalDashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { forkCount: forkCount });

                break;
            case OperationEventTopic.logFavoriteDashboard:
                let favCount = await this.dfavlRepo.count({
                    where: { dashboardId: payload.data.dashboardId }
                });
                await this.dextRepo.update(payload.data.dashboardId, { favoriteCount: favCount });

                break;
            default:
                break;
        }
    }
}