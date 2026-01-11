import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'product_explorer',
    entities: ['src/entities/*.entity.ts'],
    synchronize: true,
});

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');

        console.log('✅ Database schema synchronized');
        console.log('💡 Database is ready. Run the application to start scraping data.');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
}

void seed();
