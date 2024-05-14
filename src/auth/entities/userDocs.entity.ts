import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name:'user_docs' })

export class UserDocs {

    @PrimaryGeneratedColumn('uuid')
    id:number;


    @Column()
    userId:string;

    @Column()
    path:string;

    @Column()
    original_name:string;

    @Column()
    document_type:string;

    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
    
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;


}