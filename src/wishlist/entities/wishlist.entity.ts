// trade.entity.ts
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

enum Category {
  Forex = 0,
  Indices = 1,
  Metals = 2,
}
@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  fullPairName: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ default: false })
  isActive: boolean    //for trade allowed or not as per currency time of trading e.g. some items not provide 24*5 

  @Column({ default: false })
  isAdded: boolean     // which represents whether the stock is added or bided.

  @Column({ type: 'enum', enum: Category, default: 0 })
  categoryId: Category;

  @Column('decimal', { precision: 10, scale: 5, nullable: true })
  bidPrice: number;

}
