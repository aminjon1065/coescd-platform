import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Department } from '../departments/entities/department.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['department'] });
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'isActive', 'refreshToken'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      password: hash,
      role: dto.role ?? 'user',
    });

    if (dto.departmentId) {
      user.department = { id: dto.departmentId } as Department;
    }
    return plainToInstance(User, await this.userRepository.save(user), {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.departmentId) {
      user.department = { id: dto.departmentId } as Department;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async block(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    user.blockedAt = new Date();
    return this.userRepository.save(user);
  }

  async unblock(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    user.blockedAt = null;
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: undefined });
  }
}
