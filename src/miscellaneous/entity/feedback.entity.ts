import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name:'feedback-form' })
export class FeedbackForm {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    name:string;

    @Column()
    phone_number:string;

    @Column()
    description:string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
}