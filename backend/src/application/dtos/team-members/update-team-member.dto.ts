import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberDto } from '@/application/dtos/team-members/create-team-member.dto';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}
