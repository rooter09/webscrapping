import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    @Index()
    productId: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    author: string;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    text: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    title: string;

    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @Column({ type: 'timestamp', nullable: true })
    reviewDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Product, (product) => product.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
