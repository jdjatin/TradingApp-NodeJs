/* eslint-disable prettier/prettier */
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'groups' })

export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'margin', nullable: true })
    margin: number;                 //it will be calculated based number of times

    @ManyToOne(() => User, (user) => user.groups)   //manager reference using userId
    @JoinTable({ name: 'groups_users' })
    user: User[]


    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;

}