// otp.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, user => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()  // ← KEEP THIS - Creates userId column in Otp table
  user: User;
}