/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'groups_users' })

export class GroupUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name:'group_id'})
    groupId: string;

    @Column({name:'user_id'})
    userId: string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
    
}