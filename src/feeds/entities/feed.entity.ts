import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feed {
  //   @PrimaryGeneratedColumn()
  //   id: number;

  @Column()
  symbol: string;

  @Column('decimal', { precision: 10, scale: 2 })
  bid: number;

  @Column('decimal', { precision: 10, scale: 2 })
  ask: number;

  @Column()
  ts: string;

  @Column()
  mid: number;
}
