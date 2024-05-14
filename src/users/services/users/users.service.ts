/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserProfile } from '../../../users/entities/user_profile.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>
  ) {

  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id): Promise<User> {
    return this.userRepository.findOne({ where: { id } })
  }

  async create(userData: any) {
    const res = await this.userRepository.save(
      {
        ...userData,
        email: userData.email.toLowerCase(),
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        password: userData.password,  //need to encrypt
        token: userData.token,
        isVerified: true
      },
      { transaction: true },
    );
    if (res) {
      const newData = await this.userProfileRepository.save({
        user: res.id,
        company: userData.company,
        phone: userData.phone,
        country: userData.country,
        zipCode: userData.zipCode,
        state: userData.state,
        city: userData.city,
        address: userData.address,
        periodEndOnNotificationMailID: userData.periodEndOnNotificationMailID,
        vatReturnsDateNotificationMailID: userData.vatReturnsDateNotificationMailID,
      });

      return { ...res, newData };

    }
  }

  async update(id, user: User): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id): Promise<void> {
    await this.userRepository.delete(id);
  }

  async assignRole(data) {
    return await this.userRepository.update({ id: data.user_id }, { role: data.role });
  }

}
