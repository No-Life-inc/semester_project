import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/SqlConfig';

class BookCollection extends Model {}

// Initialize the model
BookCollection.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // Pass the sequelize instance
    tableName: 'book_collections',
    timestamps: false // Disable timestamps if not needed
});

export default BookCollection;
