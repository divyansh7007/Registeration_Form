import mongoose from 'mongoose'

const dbUrl = process.env.NEXT_PUBLIC_DB_URI;

const dbConnectionHandler = async () => {
    if (mongoose.connection.readyState === 0) {
        return mongoose.connect(dbUrl)
            .then(() => {
                console.log('MongoDB connected successfully');
            })
            .catch(err => {
                console.error('MongoDB connection error:', err);
            });
    } else {
        return console.log('MongoDB connection already established');
    }
}

export default dbConnectionHandler;