import { Module } from '@nestjs/common';
import { TeamMembersApplicationModule } from '@/application/services/team-members/team-members.module';
import {
  TeamMembersController,
  TeamMembersAdminController,
} from '@/presentation/controllers/team-members.controller';

@Module({
  imports: [TeamMembersApplicationModule],
  controllers: [TeamMembersController, TeamMembersAdminController],
})
export class TeamMembersPresentationModule {}
