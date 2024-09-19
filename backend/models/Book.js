import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';


const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publisher_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'books',
    timestamps: false
});

export default Book;