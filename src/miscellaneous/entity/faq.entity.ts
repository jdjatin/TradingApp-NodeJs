import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name:'faqs'})
export class faq {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    question:string;

    @Column()
    answer:string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;

    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;

}