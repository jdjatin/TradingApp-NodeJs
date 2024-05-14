import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, Unique } from "typeorm";

@Entity({ name:'user_profile' })

export class CompleteProfile {
    @PrimaryGeneratedColumn('uuid')
    id: number;
  
    @Column({name:'user_id'})
    userId: string;

    @Column({nullable:true,name:'address'})
    address:string;

    @Column({nullable:true,name:'city'})
    city:string;

    @Column({nullable:true,name:'state'})
    state:string;
  
    @Column({nullable:true,name:'Country'})
    country:string;
  
    @Column({nullable:true,name:'Date Of Birth'})
    DOB: string;

    @Column({nullable:true,name:'Gender'})
    gender: string;  

    @Column({nullable:true,enum:['Admin', 'Agriculture', 'Accountancy', 'Admin / Secretarial', 'Catering / Hospitality', 'Marketing / PR', 'Education', 'Engineering', 'Financial Services', 'Healthcare', 'IT', 'Legal', 'Manufacturing', 'Military', 'Property / Construction', 'Retail / Sales', 'Telecommunications', 'Transport / Logistics', 'Others']})
    occupation:string;

    @Column({nullable:true,enum:['Employed (Full time)','Self-employed','Employed (Part time)','Unemployed','Student','Retired']})
    employment_status:string;

    @Column({nullable:true,enum:['Yes, I have less than 1 year of trading experience','Yes, I have 1+ years of trading experience','Yes, I have 2+ years of trading experience','Yes, I have 4+ years of trading experience','No, I have no trading experience']})
    previous_trading_experience:string;

    @Column({nullable:true,enum:['Investment' ,'Hedging' ,'Speculation']})
    purpose:string;

    @Column({nullable:true,enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    annual_income:string;

    @Column({nullable:true,enum:['$100,000 - $200,000','$50,000 - $100,000','$20,000 - $50,000','More than $200,000','$0 - $20,000']})
    total_wealth:string;

    @Column({nullable:true,enum:['Savings','Employment / business proceeds','Rent','Inheritance','Borrowed funds / loan','Pension']})
    income_source:string;

    @Column({nullable:true,type: 'json'})
    symbols:Symbol
  
    @CreateDateColumn({ name: 'created_at' }) 'created_at': Date;
    
    @UpdateDateColumn({ name: 'updated_at' }) 'updated_at': Date;
  
  }
  export interface Symbol {
    symbols: {
      name: string;
    }[];
  }