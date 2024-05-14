/* eslint-disable prettier/prettier */
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToOne, ManyToMany, IsNull, Unique } from 'typeorm';

@Entity({ name: 'deposits' })

export class Deposit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'provider' })
    provider: string;

    @Column({ name: 'transaction_id', unique: true, type: 'varchar' })
    transactionId: string;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'status', enum: ['pending', 'completed', 'failed'] })
    status: string;

    @Column({ name: 'transaction_type', enum: ["Deposit", "Withdrawl", "Transfer", "Refund", "Reward", "Rebate", "Order"]})
    transactionType: string;

    @Column('json', { nullable: true })
    payload: string;

    @ManyToOne(() => User, (user) => user.groups)   //customer reference using userId
    user: User


    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}