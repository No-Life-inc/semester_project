import {DataTypes, Model, Optional} from "sequelize"
import sequelize from "../../config/SqlConfig"

interface BookStatsAttributes {
    book_id: number;
    collection_count: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookStatsCreationAttributes extends Optional<BookStatsAttributes, "createdAt"> {}

class BookStats extends Model<BookStatsAttributes, BookStatsCreationAttributes> implements BookStatsAttributes {
    public book_id!: number;
    public collection_count!: number;
    public createdAt?: Date;
    public updatedAt?: Date;
}

BookStats.init(
    {
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'books', key: 'id' },
            onDelete: 'CASCADE',
        },
        collection_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
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


