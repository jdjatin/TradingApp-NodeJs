/* eslint-disable prettier/prettier */
import { Order } from '../../orders/entities/order.entity';
import { Group } from '../../manager/entities/groups.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinTable, JoinColumn } from 'typeorm';
import { UserProfile } from './user_profile.entity';

@Entity({ name: 'users' })

export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ enum: ['admin', 'customer', 'manager'], default: 'customer' })
    role: string;

    @Column({ nullable: true })
    token: string;


    @OneToMany(() => Group, (group) => group.user)
    @JoinTable({ name: 'groups_users' })
    groups: Group[]


    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]


    @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profiles: UserProfile[]


    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isVerified: boolean;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}