import { PrismaClient, ProjectStatus, TeamRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@jardimdesoftware.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.SEED_ADMIN_NAME || 'Administrador';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: passwordHash,
      name,
    },
  });

  console.log(`Admin user ready: ${admin.email} (id: ${admin.id})`);
}

async function seedContent() {
  const docente = await prisma.teamMember.upsert({
    where: { slug: 'maria-docente' },
    update: {},
    create: {
      slug: 'maria-docente',
      name: 'Maria Oliveira',
      roleType: TeamRole.DOCENTE,
      roleTitle: 'Coordenadora do Jardim de Software',
      bio: 'Professora do IFPE Campus Belo Jardim, orientadora do grupo de extensão.',
      active: true,
      order: 1,
    },
  });

  const discente1 = await prisma.teamMember.upsert({
    where: { slug: 'joao-discente' },
    update: {},
    create: {
      slug: 'joao-discente',
      name: 'João Silva',
      roleType: TeamRole.DISCENTE,
      roleTitle: 'Desenvolvedor Full Stack',
      bio: 'Estudante de Análise e Desenvolvimento de Sistemas, integrante do Jardim de Software.',
      active: true,
      order: 2,
    },
  });

  const discente2 = await prisma.teamMember.upsert({
    where: { slug: 'ana-discente' },
    update: {},
    create: {
      slug: 'ana-discente',
      name: 'Ana Souza',
      roleType: TeamRole.DISCENTE,
      roleTitle: 'Desenvolvedora Front-end',
      bio: 'Estudante de Análise e Desenvolvimento de Sistemas, integrante do Jardim de Software.',
      active: true,
      order: 3,
    },
  });

  const projectEmDesenvolvimento = await prisma.project.upsert({
    where: { slug: 'site-jardim-de-software' },
    update: {},
    create: {
      slug: 'site-jardim-de-software',
      title: 'Site do Jardim de Software',
      summary: 'Site institucional do grupo de extensão Jardim de Software.',
      description:
        'Plataforma web com backend em NestJS/Prisma para divulgar projetos, notícias e integrantes do grupo.',
      status: ProjectStatus.EM_DESENVOLVIMENTO,
      category: 'Web',
      featured: true,
      order: 1,
    },
  });

  const projectConcluido = await prisma.project.upsert({
    where: { slug: 'sistema-de-controle-de-estoque' },
    update: {},
    create: {
      slug: 'sistema-de-controle-de-estoque',
      title: 'Sistema de Controle de Estoque',
      summary: 'Aplicação para controle de estoque de pequenos comércios locais.',
      description:
        'Sistema desenvolvido em parceria com comerciantes de Belo Jardim para gestão simplificada de estoque.',
      status: ProjectStatus.CONCLUIDO,
      category: 'Web',
      featured: false,
      order: 2,
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_teamMemberId: {
        projectId: projectEmDesenvolvimento.id,
        teamMemberId: docente.id,
      },
    },
    update: {},
    create: {
      projectId: projectEmDesenvolvimento.id,
      teamMemberId: docente.id,
      roleLabel: 'Orientadora',
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_teamMemberId: {
        projectId: projectEmDesenvolvimento.id,
        teamMemberId: discente1.id,
      },
    },
    update: {},
    create: {
      projectId: projectEmDesenvolvimento.id,
      teamMemberId: discente1.id,
      roleLabel: 'Desenvolvedor Backend',
    },
  });

  await prisma.projectMember.upsert({
    where: {
      projectId_teamMemberId: {
        projectId: projectConcluido.id,
        teamMemberId: discente2.id,
      },
    },
    update: {},
    create: {
      projectId: projectConcluido.id,
      teamMemberId: discente2.id,
      roleLabel: 'Desenvolvedora Front-end',
    },
  });

  await prisma.newsPost.upsert({
    where: { slug: 'jardim-de-software-lanca-novo-site' },
    update: {},
    create: {
      slug: 'jardim-de-software-lanca-novo-site',
      title: 'Jardim de Software lança novo site',
      excerpt: 'Grupo de extensão do IFPE Campus Belo Jardim renova sua presença online.',
      body: 'O Jardim de Software lançou uma nova versão do seu site institucional, com uma área administrativa para facilitar a divulgação de projetos, notícias e integrantes.',
      published: true,
      publishedAt: new Date(),
      authorId: docente.id,
    },
  });

  const testimonialExists = await prisma.testimonial.findFirst({
    where: { teamMemberId: discente1.id, projectId: projectEmDesenvolvimento.id },
  });
  if (!testimonialExists) {
    await prisma.testimonial.create({
      data: {
        quote:
          'Participar do Jardim de Software foi essencial para minha formação prática como desenvolvedor.',
        authorName: 'João Silva',
        authorRoleLabel: 'Ex-integrante, Discente',
        teamMemberId: discente1.id,
        projectId: projectEmDesenvolvimento.id,
        featured: true,
        order: 1,
      },
    });
  }

  const statsCount = await prisma.siteStat.count();
  if (statsCount === 0) {
    await prisma.siteStat.createMany({
      data: [
        { label: 'PROJETOS', value: '2+', order: 1 },
        { label: 'MEMBROS', value: '3+', order: 2 },
      ],
    });
  }

  console.log('Content seed data ready.');
}

async function main() {
  console.log('Starting seeding...');
  await seedAdminUser();
  await seedContent();
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
