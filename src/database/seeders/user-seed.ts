import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const password = await bcrypt.hash('admin123', 10);

    const admin = userRepository.create({
      email: 'admin@coescd.tj',
      password,
      role: 'admin',
      isActive: true,
    });

    await userRepository.save(admin);

    console.log('✅ Admin user seeded!');
  }
}
