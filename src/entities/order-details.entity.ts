import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrderHeader } from './order-header.entity';

/* -------------------------------------- */

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn('increment')
  id: number;
  
  @Column()
  product_id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderHeader, (orderHeader) => orderHeader.orderDetails, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  orderHeader: OrderHeader;
}

/* -------------------------------------- */


