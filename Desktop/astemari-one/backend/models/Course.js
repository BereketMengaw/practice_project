const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Assuming the User model is in the same directory

class Course extends Model {}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true, // Enable auto-increment
      primaryKey: true, // Set as primary key
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Reference to the User model
        key: "id", // Foreign key in the User table
      },
    },
  },
  {
    sequelize,
    modelName: "Course",
    timestamps: true,
  }
);

// Set up the association between Course and User
Course.belongsTo(User, {
  foreignKey: "creatorId", // This makes creatorId the foreign key
  as: "creator", // This is the alias to access the associated User (creator) from Course
});

module.exports = Course;
