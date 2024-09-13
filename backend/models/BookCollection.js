import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';


const BookCollection = sequelize.define('BookCollection', {
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
    tableName: 'book_collections',
    timestamps: false
});

export default BookCollection;
