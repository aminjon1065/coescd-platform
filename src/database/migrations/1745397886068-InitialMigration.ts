import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745397886068 implements MigrationInterface {
    name = 'InitialMigration1745397886068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "blockedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "blockedAt"`);
    }

}
