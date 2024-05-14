import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'managers' })

export class Manager {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name:'user_id'})
    userId: string;

    @Column({ name: 'contact_number' })
    contactNumber: string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
}
