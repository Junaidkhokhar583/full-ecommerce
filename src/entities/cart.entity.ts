// cart.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column} from 'typeorm';
import { User } from "./user.entity"

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.carts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'jsonb' })
  items: any[];

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;
}
