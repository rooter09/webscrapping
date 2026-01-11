import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('view_history')
export class ViewHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index()
    userId: string;

    @Column({ type: 'varchar', length: 255 })
    @Index()
    sessionId: string;

    @Column({ type: 'jsonb' })
    pathJson: Record<string, any>;

    @Column({ type: 'varchar', length: 500 })
    url: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    productId: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    categoryId: string;

    @CreateDateColumn()
    @Index()
    createdAt: Date;
}
