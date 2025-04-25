import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  @Expose()
  refreshToken?: string;

  @Column({ default: 'user' })
  @Expose()
  role: string;

  @Column({ default: true })
  @Expose()
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  blockedAt: Date | null;

  @ManyToOne(() => Department, (department) => department.users, {
    nullable: true,
  })
  @Expose()
  department: Department;
}
