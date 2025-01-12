import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from '~/common/types/extended-interfaces';
import { errors } from '~/common/util/error-messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity, 'DbConnection')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  baseQueryBuilder(): SelectQueryBuilder<UserEntity> {
    return this.userRepository.createQueryBuilder('user');
  }

  findOne(id: string): Promise<UserEntity | null> {
    const qb = this.baseQueryBuilder();
    qb.where('user.id = :id', { id });
    return qb.getOne();
  }

  async findByUserEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(errors.user.not_found);
    }

    return await this.userRepository.update(id, updateUserDto);
  }

  async updateProfile(user: RequestWithUser['user'], updateUserDto: UpdateUserDto) {
    return await this.userRepository.update({ id: user.id }, updateUserDto);
  }

  async save(user: UserEntity) {
    return this.userRepository.save(user);
  }

  async delete(id: string) {
    await this.userRepository.delete({ id });
  }
}
