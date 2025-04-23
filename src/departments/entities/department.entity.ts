import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Department, (dept) => dept.children, { nullable: true })
  parent: Department;

  @OneToMany(() => Department, (dept) => dept.parent)
  children: Department[];

  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
