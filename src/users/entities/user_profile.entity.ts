// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.profiles)   //customer reference using userId
    user: User


    @Column({nullable:true})
    company: string;

    @Column({nullable:true})
    phone: string;

    @Column({nullable:true})
    country: string;

    @Column({nullable:true})
    zipCode: number;

    @Column({nullable:true})
    state: string;

    @Column({nullable:true})
    city: string;

    @Column({nullable:true})
    address: string;

    @Column({type: 'json',nullable:true})
    symbols: Symbol
}

export interface Symbol {
    symbols: {
      name: string;
    }[];
  }

