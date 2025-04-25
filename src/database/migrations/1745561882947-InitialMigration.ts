import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1745561882947 implements MigrationInterface {
    name = 'InitialMigration1745561882947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
