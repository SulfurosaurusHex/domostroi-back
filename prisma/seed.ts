import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [health, art, social, beauty, science, household] =
    await prisma.feature.createManyAndReturn({
      select: { id: true },
      data: [
        {
          id: 'feature_health',
          name: 'Здоровье',
          description: '',
        },
        {
          id: 'feature_art',
          name: 'Искусство',
          description: '',
        },
        {
          id: 'feature_social',
          name: 'Социализация',
          description: '',
        },
        {
          id: 'feature_beauty',
          name: 'Красота',
          description: '',
        },
        {
          id: 'feature_science',
          name: 'Науки',
          description: '',
        },
        {
          id: 'feature_household',
          name: 'Хозяйство',
          description: '',
        },
      ],
    });

  const [
    mentalHealth,
    physicalHealth,
    fineArts,
    appliedArts,
    performingArts,
    culture,
    fun,
    networking,
    communication,
    body,
    aethetic,
    humanScience,
    technicalScience,
    languages,
    erudition,
    foraging,
    culinary,
    homekeeping,
  ] = await prisma.feature.createManyAndReturn({
    select: { id: true },
    data: [
      {
        id: 'feature_mental_health',
        name: 'Ментальное здоровье',
        description: '',
        parentBrunchId: health.id,
      },
      {
        id: 'feature_physical_health',
        name: 'Физическое здоровье',
        description: '',
        parentBrunchId: health.id,
      },
      {
        id: 'feature_fine_arts',
        name: 'Изобразительное искусство',
        description: '',
        parentBrunchId: art.id,
      },
      {
        id: 'feature_applied_arts',
        name: 'Прикладное искусство',
        description: '',
        parentBrunchId: art.id,
      },
      {
        id: 'feature_performing_arts',
        name: 'Исполнительское искусство',
        description: '',
        parentBrunchId: art.id,
      },
      {
        id: 'feature_culture',
        name: 'Культура',
        description: '',
        parentBrunchId: art.id,
      },
      {
        id: 'feature_fun',
        name: 'Развлечения',
        description: '',
        parentBrunchId: social.id,
      },
      {
        id: 'feature_networking',
        name: 'Связи',
        description: '',
        parentBrunchId: social.id,
      },
      {
        id: 'feature_communication',
        name: 'Общение',
        description: '',
        parentBrunchId: social.id,
      },
      {
        id: 'feature_body',
        name: 'Тело',
        description: '',
        parentBrunchId: beauty.id,
      },
      {
        id: 'feature_aethetic',
        name: 'Эстетика',
        description: '',
        parentBrunchId: beauty.id,
      },
      {
        id: 'feature_human_science',
        name: 'Гуманитарные науки',
        description: '',
        parentBrunchId: science.id,
      },
      {
        id: 'feature_technical_science',
        name: 'Технические науки',
        description: '',
        parentBrunchId: science.id,
      },
      {
        id: 'feature_languages',
        name: 'Иностранные языки',
        description: '',
        parentBrunchId: science.id,
      },
      {
        id: 'feature_erudition',
        name: 'Эрудиция',
        description: '',
        parentBrunchId: science.id,
      },
      {
        id: 'feature_foraging',
        name: 'Собирательство',
        description: '',
        parentBrunchId: household.id,
      },
      {
        id: 'feature_culinary',
        name: 'Кулинария',
        description: '',
        parentBrunchId: household.id,
      },
      {
        id: 'feature_homekeeping',
        name: 'Домашнее хозяйство',
        description: '',
        parentBrunchId: household.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
