import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedingChanges1761820329867 implements MigrationInterface {
    name = 'SeedingChanges1761820329867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_name"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_name" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_date" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_location"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_location" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_description"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_description" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_description"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_location"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_location" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_date"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_date" varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_name"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_name" varchar(255) NOT NULL`);
    }

}
