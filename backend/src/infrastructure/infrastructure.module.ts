import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PrismaAdminUserRepository } from '@/infrastructure/repositories/prisma-admin-user.repository';
import { IAdminUserRepository } from '@/domain/repositories/admin-user.repository';
import { IHashService } from '@/application/ports/hash.service';
import { BcryptHashService } from '@/infrastructure/services/bcrypt-hash.service';
import { ITeamMemberRepository } from '@/domain/repositories/team-member.repository';
import { PrismaTeamMemberRepository } from '@/infrastructure/repositories/prisma-team-member.repository';
import { IProjectRepository } from '@/domain/repositories/project.repository';
import { PrismaProjectRepository } from '@/infrastructure/repositories/prisma-project.repository';
import { INewsPostRepository } from '@/domain/repositories/news-post.repository';
import { PrismaNewsPostRepository } from '@/infrastructure/repositories/prisma-news-post.repository';
import { IPublicationRepository } from '@/domain/repositories/publication.repository';
import { PrismaPublicationRepository } from '@/infrastructure/repositories/prisma-publication.repository';
import { ITestimonialRepository } from '@/domain/repositories/testimonial.repository';
import { PrismaTestimonialRepository } from '@/infrastructure/repositories/prisma-testimonial.repository';
import { ISiteStatRepository } from '@/domain/repositories/site-stat.repository';
import { PrismaSiteStatRepository } from '@/infrastructure/repositories/prisma-site-stat.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: IAdminUserRepository, useClass: PrismaAdminUserRepository },
    { provide: IHashService, useClass: BcryptHashService },
    { provide: ITeamMemberRepository, useClass: PrismaTeamMemberRepository },
    { provide: IProjectRepository, useClass: PrismaProjectRepository },
    { provide: INewsPostRepository, useClass: PrismaNewsPostRepository },
    { provide: IPublicationRepository, useClass: PrismaPublicationRepository },
    { provide: ITestimonialRepository, useClass: PrismaTestimonialRepository },
    { provide: ISiteStatRepository, useClass: PrismaSiteStatRepository },
  ],
  exports: [
    PrismaModule,
    IAdminUserRepository,
    IHashService,
    ITeamMemberRepository,
    IProjectRepository,
    INewsPostRepository,
    IPublicationRepository,
    ITestimonialRepository,
    ISiteStatRepository,
  ],
})
export class InfrastructureModule {}
