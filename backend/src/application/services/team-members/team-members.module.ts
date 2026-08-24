import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { TeamMembersService } from './team-members.service';

@Module({
  imports: [InfrastructureModule],
  providers: [TeamMembersService],
  exports: [TeamMembersService],
})
export class TeamMembersApplicationModule {}
