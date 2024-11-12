import "./models/sequelize/Associations"
import UserBook from "./models/sequelize/UserBook";
import sequelize from "./config/SqlConfig";

(async () => {
    try {
        await sequelize.authenticate(); // Initialize Sequelize
        console.log("Associations for UserBook:", UserBook.associations);
    } catch (error) {
        console.error("Error checking associations:", error);
    } finally {
        await sequelize.close(); // Close the connection after logging
    }
})();