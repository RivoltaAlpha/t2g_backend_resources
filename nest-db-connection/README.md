# MSSQL + TypeORM Integration Guide for NestJS

Complete guide to integrate Microsoft SQL Server with TypeORM in a NestJS application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Configuration](#database-configuration)
- [Entity Column Types](#entity-column-types)
- [Setting Up Entities](#setting-up-entities)
- [Migrations](#migrations)
---

## Prerequisites

- Node.js (v14 or higher)
- NestJS application
- Access to MSSQL Server (local, Azure SQL, or other cloud provider)

---

## Installation

### 1. Install Required Packages

```bash
pnpm install @nestjs/typeorm typeorm mssql
pnpm install @nestjs/config dotenv
```

### 2. Package Versions (Recommended)

```json
{
  "dependencies": {
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "mssql": "^10.0.1",
    "@nestjs/config": "^3.1.1"
  }
}
```

---

## Database Configuration

### 1. Create Database Module

**File: `src/database/database.config.ts`**

```typescript
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA || 'dbo',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    enableAnsiNullDefault: true,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    min: parseInt(process.env.DB_POOL_MIN || '0'),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'),
  },
}));
```

**File: `src/database/database.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('database')
            }),
            inject: [ConfigService]
        })
    ],
})
export class DatabaseModule {}
```

### 2. Import Database Module

**File: `src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    DatabaseModule,
    // ... other modules
  ],
})
export class AppModule {}
```

### 3. Environment Variables

**File: `.env`**

```env
# Database Connection
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword123!
DB_NAME=your_database_name
DB_SCHEMA=dbo

# MSSQL Options
DB_ENCRYPT=false              # Set to true for Azure SQL
DB_TRUST_CERT=true           # Set to true for local development
DB_INSTANCE_NAME=             # Optional: for named instances

# Connection Pool
DB_POOL_MAX=10
DB_POOL_MIN=0

# Development Settings
DB_SYNC=false                # NEVER true in production!
DB_LOGGING=true              # Enable for debugging
```

**For Azure SQL Database:**

```env
DB_HOST=your-server.database.windows.net
DB_PORT=1433
DB_USERNAME=your-admin-username
DB_PASSWORD=YourSecurePassword123!
DB_NAME=your-database-name
DB_SCHEMA=dbo
DB_ENCRYPT=true              # MUST be true for Azure
DB_TRUST_CERT=false
```

---

### Recommended Types for Common Scenarios

```typescript
// Primary Keys
@PrimaryGeneratedColumn()
id: number; // int with IDENTITY

@PrimaryGeneratedColumn('uuid')
id: string; // uniqueidentifier

// Strings
@Column({ type: 'varchar', length: 255 })
name: string; // Short text, supports Unicode

@Column({ type: 'varchar', length: 'MAX' })
description: string; // Long text, supports Unicode

@Column({ type: 'varchar', length: 100 })
code: string; // Short ASCII-only text

// Numbers
@Column({ type: 'int' })
count: number;

@Column({ type: 'bigint' })
largeNumber: number;

@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number; // For currency/precise values

@Column({ type: 'float' })
rating: number; // For approximate values

// Boolean
@Column({ type: 'bit' })
isActive: boolean;

// Dates
@CreateDateColumn({ type: 'datetime2' })
createdAt: Date;

@UpdateDateColumn({ type: 'datetime2' })
updatedAt: Date;

@Column({ type: 'date' })
birthDate: Date;

@Column({ type: 'datetimeoffset' })
scheduledAt: Date; // With timezone

// UUID
@Column({ type: 'uniqueidentifier' })
uuid: string;

// JSON (stored as string)
@Column({ type: 'varchar', length: 'MAX' })
metadata: string; // Store JSON.stringify() data

// Enum (stored as int or string)
@Column({ type: 'varchar', length: 50 })
status: 'active' | 'inactive' | 'pending';

// Binary Data
@Column({ type: 'varbinary', length: 'MAX' })
fileData: Buffer;
```

---

## Setting Up Entities

### Example Entity with All Common Types

**File: `src/entities/user.entity.ts`**

```typescript
import { Event } from "../../events/entities/event.entity";
import { Feedback } from "../../feedback/entities/feedback.entity";
import { Registration } from "../../registrations/entities/registration.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";


export enum UserRole{
    Admin = 'Admin',
    User = 'user',
    Organizer = 'Organizer',
    Guest = 'Guest'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;
    
    @Column({type: 'varchar', length: 255, nullable: false})
    email:string;

    @Column({type: 'varchar', length: 255, nullable: false})
    password: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    phone:string;

    @Column({type: 'varchar', length: 255, nullable: false})
    hashedRefreshedToken?: string|null; 

    @Column({
        type: 'varchar',
        length: 10,
        default: UserRole.User
    })
    role: UserRole;
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    @OneToMany(() => Feedback, (feedback) => feedback.user)
    feedback: Feedback;

    @OneToMany(() => Registration, (registration) => registration.user)
    registration: Registration;

    @OneToMany(() => Event, (event) => event.user)
    event: Event;
}
```

### Example with Relations

**File: `src/entities/registration.entity.ts`**

```typescript
import { Event } from "../../events/entities/event.entity";
import { Payment } from "../../payments/entities/payment.entity";
import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToOne } from "typeorm";


export enum PaymentStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed'
}

@Entity('registrations')
export class Registration {
    @PrimaryGeneratedColumn()
    registration_id: number;

    @Column({type: 'datetime2'})
    registration_date: Date;

    @Column({
        type: 'varchar',
        length: 10,
        default: PaymentStatus.Pending
    })
    payment_status: PaymentStatus;

    @Column({type: 'decimal', precision: 10, scale: 2})
    payment_amount:number; 
    
    @CreateDateColumn({type: 'datetime2'})
    created_at: Date;

    @UpdateDateColumn({type: 'datetime2'})
    updated_at: Date;

    // events and user relationships
    @OneToOne(() => Payment, (payment) => payment.registration)
    payment: Payment

    @ManyToOne(() => Event, (event) => event.registration)
    @JoinColumn({name: 'event_id'})
    event: Event;

    @ManyToOne(() => User, (user) => user.registration)
    @JoinColumn({name: 'user_id'})
    user: User;
}
```

### Register Entities in Module

**File: `src/users/users.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## Migrations


- [Database Setup](#database-setup)
- [Initial Migration Setup](#initial-migration-setup)
- [Migration Commands Reference](#migration-commands-reference)
- [Working with Entity Changes](#working-with-entity-changes)
- [Best Practices](#best-practices)

---

## Database Setup

### Creating a Database User

Open SQL Server Management Studio (SSMS), connect as an administrator (SA account), and execute the following script:

```sql
USE [nest-conn]
GO

-- Create login if it doesn't exist
CREATE LOGIN [Tifany Nyawira] WITH PASSWORD = 'PASSWORD'
GO

-- Create database user and assign permissions
CREATE USER [Tifany Nyawira] FOR LOGIN [Tifany Nyawira]
GO

ALTER ROLE db_owner ADD MEMBER [Tifany Nyawira]
GO
```

### Environment Configuration

Update your `.env` file with the proper credentials:

```env
# Database Connection
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=Tifany Nyawira
DB_PASSWORD=PASSWORD
# ...rest of the file remains the same...
```

### Restart Services

After making these changes:
1. Restart your SQL Server service
2. Restart your NestJS application

---

### Setup TypeORM CLI

**File: `ormconfig.ts`** (root directory)

```typescript
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA || 'dbo',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    enableAnsiNullDefault: true,
  },
});
```

### Add Migration Scripts

**File: `package.json`**

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d ormconfig.ts",
    "migration:generate": "typeorm-ts-node-commonjs -d ormconfig.ts migration:generate",
    "migration:create": "typeorm-ts-node-commonjs -d ormconfig.ts migration:create",
    "migration:run": "typeorm-ts-node-commonjs -d ormconfig.ts migration:run",
    "migration:revert": "typeorm-ts-node-commonjs -d ormconfig.ts migration:revert",
    "migration:show": "typeorm-ts-node-commonjs -d ormconfig.ts migration:show"
  }
}
```

### Generate Your First Migration

Create your initial migration by running:

```bash
pnpm run migration:generate src/migrations/InitialMigration
```

This command will:
- Create a new migration file in the `src/migrations` directory
- Name it with a timestamp followed by "InitialMigration"
- Generate the SQL needed based on your entity definitions

### Run the Migration

After generating the migration, apply it to your database:

```bash
pnpm run migration:run
```

### Check Migration Status

To verify which migrations have been applied:

```bash
pnpm run migration:show
```

### Prerequisites

Before running migrations, ensure:
- Your database connection is properly configured
- Your database server is running
- All your entities are properly defined and imported in your application

---


## Migration Commands Reference

### Command Structure

Each command uses `typeorm-ts-node-commonjs` with your `ormconfig.ts` file:

```bash
pnpm run migration:generate src/migrations/RelationshipsMigration
```

This executes:
```bash
typeorm-ts-node-commonjs -d ormconfig.ts migration:generate src/migrations/RelationshipsMigration
```

### Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `typeorm` | General TypeORM CLI | `pnpm run typeorm [command]` |
| `migration:generate` | Automatically creates migrations by comparing entities to database | `pnpm run migration:generate path/name` |
| `migration:create` | Creates an empty migration file | `pnpm run migration:create path/name` |
| `migration:run` | Runs pending migrations | `pnpm run migration:run` |
| `migration:revert` | Reverts the last executed migration | `pnpm run migration:revert` |
| `migration:show` | Shows all migrations and their status | `pnpm run migration:show` |

### How the Commands Work

When you run `pnpm run migration:generate`, TypeORM will:
1. Use the configuration in `ormconfig.ts`
2. Generate a migration by comparing your entities with the current database schema
3. Save it in the migrations directory with a timestamped filename

**Example successful output:**
```
Migration C:\Users\Tifany Nyawira\Documents\Documents\Training-Resources\NEST\Nest-refresher-master\src\migrations/1761076169914-RelationshipsMigration.ts has been generated successfully.
```

---

## Working with Entity Changes

### Complete Workflow

Follow these steps whenever you modify your entity definitions:

#### 1. Make Changes to Your Entities
Modify your entity files as needed (add/remove fields, change relationships, etc.).

#### 2. Generate a New Migration
Capture the entity changes in a new migration:

```bash
pnpm run migration:generate src/migrations/EntityChangeMigration
```

This will:
- Compare your current entities with the database schema
- Generate a new migration file with the necessary SQL to update the database
- Create a file named like `TIMESTAMP-EntityChangeMigration.ts`

#### 3. Review the Migration
Open the generated migration file and review the changes before applying them. Verify that it's doing what you expect.

#### 4. Run the Migration
Apply the changes to your database:

```bash
pnpm run migration:run
```

This executes all pending migrations, including your new one.

#### 5. Verify Changes
Connect to your database and verify that the changes have been applied correctly.

### When to Use Each Command

- **For New Changes**: Use `migration:generate` to automatically detect and create migrations
- **To Revert a Migration**: Use `migration:revert` if something goes wrong
- **To Check Migration Status**: Use `migration:show` to see which migrations have been run
- **For Custom Migrations**: Use `migration:create` to create an empty migration file and write custom SQL

### Example Workflow

```bash
# 1. Make changes to entities
# Edit your entity files...

# 2. Generate migration
pnpm run migration:generate src/migrations/AddNewFieldsMigration

# 3. Review the generated migration file
# Check src/migrations/TIMESTAMP-AddNewFieldsMigration.ts

# 4. Apply the changes to the database
pnpm run migration:run

# 5. If needed, revert the last migration
pnpm run migration:revert
```

---

## Best Practices

### 1. Make Small, Focused Changes
Create smaller migrations that are easier to manage and less likely to cause issues.

### 2. Always Back Up
Before running migrations on production, always back up your database.

### 3. Test Migrations
Run migrations on a development environment before applying them to production.

### 4. Version Control
Keep migrations in version control along with your code. Never modify migrations that have already been run.

### 5. Check Migration Status
Use `migration:show` regularly to see which migrations have been applied and verify your database state.

### 6. Sequential Application
Apply migrations in the order they were created. The timestamp in the filename ensures correct ordering.

### 7. Review Before Running
Always review generated migrations before running them to ensure they match your intentions.

---

## Troubleshooting

If you encounter issues:

1. **Check database connection**: Verify your `.env` configuration
2. **Verify TypeORM config**: Ensure `ormconfig.ts` is properly configured
3. **Check migration status**: Run `pnpm run migration:show` to see current state
4. **Review logs**: Check application and database logs for errors
5. **Revert if needed**: Use `pnpm run migration:revert` to roll back problematic migrations

---
