import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  config({ path: '.env.dev', override: true });
} else config();

const prisma = new PrismaClient({
  log: ['query'],
});

const seedAdmin = async () => {
  if (!process.env.USER_NAME || !process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
    throw new Error(
      'Environment variables USER_NAME, USER_EMAIL and USER_PASSWORD must be set',
    );
  }

  await prisma.user.create({
    data: {
      emailVerified: true,
      name: process.env.USER_NAME,
      email: process.env.USER_EMAIL,
      passwordHash: await hash(process.env.USER_PASSWORD, 6),
    },
  });
};

const seedNotes = async () => {
  if (!process.env.USER_EMAIL) {
    throw new Error('Environment variables USER_EMAIL must be set');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: process.env.USER_EMAIL,
    },
  });

  if (!user) {
    throw new Error(`User with email "${process.env.USER_EMAIL}" not found`);
  }

  await prisma.note.createMany({
    data: [
      {
        userId: user.id,
        title: 'Checklist da Reunião de Planejamento',
        content:
          'Discutir metas do trimestre, revisar orçamento e alinhar prioridades com a equipe.',
      },
      {
        userId: user.id,
        title: 'Ideias para Postagens no Blog',
        content:
          '1. Como melhorar sua produtividade\n2. Tendências de tecnologia em 2025\n3. Dicas para um trabalho remoto eficiente.',
      },
      {
        userId: user.id,
        title: 'Lista de Compras',
        content: 'Leite, ovos, pão integral, café, frango, arroz, feijão e frutas.',
      },
      {
        userId: user.id,
        title: 'Resumo do Livro "Hábitos Atômicos"',
        content:
          'Pequenos hábitos diários geram grandes mudanças ao longo do tempo. Focar na identidade e no sistema, não apenas nos resultados.',
      },
      {
        userId: user.id,
        title: 'Plano de Treino para a Semana',
        content:
          'Segunda: Peito e tríceps\nTerça: Costas e bíceps\nQuarta: Cardio\nQuinta: Pernas e ombros\nSexta: Descanso.',
      },
      {
        userId: user.id,
        title: 'Tarefas Urgentes',
        content:
          '1. Enviar relatório de desempenho\n2. Agendar reunião com fornecedor\n3. Revisar proposta do cliente.',
      },
      {
        userId: user.id,
        title: 'Receita de Panqueca Fit',
        content:
          'Misture banana, aveia e ovos. Cozinhe em fogo médio até dourar. Sirva com mel e frutas.',
      },
      {
        userId: user.id,
        title: 'Ideias para Presentes de Aniversário',
        content:
          'Livro de ficção, fone de ouvido Bluetooth, kit de skincare, experiência gastronômica.',
      },
      {
        userId: user.id,
        title: 'Aprendizados do Curso de TypeScript',
        content:
          'Uso de tipos, interfaces, generics e boas práticas para desenvolvimento seguro e escalável.',
      },
      {
        userId: user.id,
        title: 'Destinos para a Próxima Viagem',
        content: '1. Kyoto, Japão\n2. Patagônia, Argentina\n3. Santorini, Grécia.',
      },
    ],
  });
};

const seed = async () => {
  await seedAdmin();
};

(async () => {
  try {
    await seed();
    prisma.$disconnect();
  } catch (error) {
    console.log(error);
    prisma.$disconnect();
  }
})();
