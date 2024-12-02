import {DataTypes, Model, Optional} from "sequelize"
import sequelize from "../../config/SqlConfig"

interface BookStatsAttributes {
    bookId: number;
    collectionCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookStatsCreationAttributes extends Optional<BookStatsAttributes, "createdAt"> {}

class BookStats extends Model<BookStatsAttributes, BookStatsCreationAttributes> implements BookStatsAttributes {
    declare bookId: number;
    declare collectionCount: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

BookStats.init(
    {
        bookId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'books', key: 'id' },
            onDelete: 'CASCADE',
            field: "book_id",
        },
        collectionCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "collection_count",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "updated_at",
        },
    },
    {
        sequelize,
        modelName: "BookStats",
        tableName: "book_stats",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: true,
    }
);


