import { StateType } from 'src/types/enums';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderDetails } from './order-details.entity';

/* -------------------------------------- */

@Entity()
export class OrderHeader {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column({
    type: 'enum',
    enum: StateType,
    default: StateType.PENDING,
  })
  state: StateType;

  @Column()
  client_id: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  amount: number;

  @Column()
  date_delivery: Date;

  @OneToMany(() => OrderDetails, (orderDetail) => orderDetail.orderHeader, {
    cascade: true,
  })
  orderDetails: OrderDetails[];
}

/* -------------------------------------- */
