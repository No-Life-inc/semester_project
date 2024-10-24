import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../config/SqlConfig";

interface BookGenreAttributes {
    id: number;
    book_id: number;
    genre_id: number;
}


interface BookGenreCreationAttributes extends Optional<BookGenreAttributes, "id"> {}

class BookGenre extends Model<BookGenreAttributes, BookGenreCreationAttributes> implements BookGenreAttributes {
    public id!: number;
    public book_id!: number;
    public genre_id!: number;
}


BookGenre.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'books', key: 'id' },
        onDelete: 'CASCADE',
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'genres', key: 'id' },
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    modelName: "BookGenre",
    tableName: "book_genres",
    timestamps: false,
});

export default BookGenre;