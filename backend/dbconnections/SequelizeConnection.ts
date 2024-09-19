import { Sequelize } from 'sequelize';

const connectToDatabase = async (sequelize: Sequelize) => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MSSQL has been established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized with associations');
    } catch (err) {
        console.error('Unable to connect or synchronize the database:', err);
    }
};
export default connectToDatabase;