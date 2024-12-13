import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const connection = await mongoose.connect(uri);
        console.log('MongoDB connected');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const connectMongoDBWithGranularUser = async () => {
    try {
        const uri = process.env.LIMITED_MONGO_URI;
        const connection = await mongoose.connect(uri);
        console.log('MongoDB connected as granular_user');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error (granular_user):', error);
        process.exit(1);
    }
};

