-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TODO', 'HABIT', 'SMALL');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REJECTED', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "RepeatPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('SMALL', 'EASY', 'MEDIUM', 'HARD', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "families" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "last_earned_xp" TIMESTAMP(3),
    "gold" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "family_id" TEXT NOT NULL,
    "level_id" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_brach_id" TEXT,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "family_id" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "url" TEXT,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "creator_id" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'EASY',
    "repeat_period" "RepeatPeriod",
    "repeat_interval" INTEGER,
    "repeat_day" "DayOfWeek",
    "type" "TaskType" NOT NULL DEFAULT 'TODO',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_important" BOOLEAN,
    "gold" INTEGER NOT NULL DEFAULT 0,
    "family_id" TEXT,
    "goal_id" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "repeat_period" "RepeatPeriod",
    "repeat_interval" INTEGER,
    "repeat_day" "DayOfWeek",
    "deadline" TIMESTAMP(3),
    "family_id" TEXT NOT NULL,

    CONSTRAINT "traditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3),
    "progress" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listItems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_completed" BOOLEAN NOT NULL,
    "list_id" TEXT NOT NULL,

    CONSTRAINT "listItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taskCompletions" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taskCompletions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userFeatures" (
    "xp" INTEGER NOT NULL,
    "last_earned_xp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "feature_id" TEXT NOT NULL,

    CONSTRAINT "userFeatures_pkey" PRIMARY KEY ("feature_id","user_id")
);

-- CreateTable
CREATE TABLE "featureSkills" (
    "percent" INTEGER NOT NULL,
    "feature_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "featureSkills_pkey" PRIMARY KEY ("skill_id","feature_id")
);

-- CreateTable
CREATE TABLE "userSkills" (
    "xp" INTEGER NOT NULL,
    "last_earned_xp" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,

    CONSTRAINT "userSkills_pkey" PRIMARY KEY ("skill_id","user_id")
);

-- CreateTable
CREATE TABLE "taskXp" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT,
    "skill_percent" INTEGER,
    "feature_id" TEXT,
    "feature_percent" INTEGER,

    CONSTRAINT "taskXp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goalTasks" (
    "id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "order" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "goalTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditionTasks" (
    "id" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "tradition_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "traditionTasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listTasks" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "listTasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "levels_level_familyId_key" ON "levels"("level", "familyId");

-- CreateIndex
CREATE UNIQUE INDEX "lists_title_user_id_key" ON "lists"("title", "user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_parent_brach_id_fkey" FOREIGN KEY ("parent_brach_id") REFERENCES "features"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traditions" ADD CONSTRAINT "traditions_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listItems" ADD CONSTRAINT "listItems_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskCompletions" ADD CONSTRAINT "taskCompletions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskCompletions" ADD CONSTRAINT "taskCompletions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFeatures" ADD CONSTRAINT "userFeatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFeatures" ADD CONSTRAINT "userFeatures_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "featureSkills" ADD CONSTRAINT "featureSkills_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "featureSkills" ADD CONSTRAINT "featureSkills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSkills" ADD CONSTRAINT "userSkills_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSkills" ADD CONSTRAINT "userSkills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskXp" ADD CONSTRAINT "taskXp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskXp" ADD CONSTRAINT "taskXp_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taskXp" ADD CONSTRAINT "taskXp_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goalTasks" ADD CONSTRAINT "goalTasks_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goalTasks" ADD CONSTRAINT "goalTasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traditionTasks" ADD CONSTRAINT "traditionTasks_tradition_id_fkey" FOREIGN KEY ("tradition_id") REFERENCES "traditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traditionTasks" ADD CONSTRAINT "traditionTasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listTasks" ADD CONSTRAINT "listTasks_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listTasks" ADD CONSTRAINT "listTasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
