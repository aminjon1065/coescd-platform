import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Department } from './src/departments/entities/department.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Department],
  synchronize: false,
});
