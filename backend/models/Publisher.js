import { DataTypes } from 'sequelize';
import sequelize from '../config/SqlConfig.js';

const Publisher = sequelize.define('Publisher', {
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
    tableName: 'publishers',
    timestamps: false
});

export default Publisher;
