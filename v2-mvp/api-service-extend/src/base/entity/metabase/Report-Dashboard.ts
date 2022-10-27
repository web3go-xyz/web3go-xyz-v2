import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'report_dashboard' })
export class ReportDashboard {
    @ApiProperty({ description: 'dashboard id' })
    @PrimaryColumn({
        type: 'int4',
        comment: 'dashboard id',
        nullable: false
    })
    id: number;


}