const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust the path based on your setup

const Earning = sequelize.define(
  "Earning",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      // If the field is 'studentId'
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Courses", key: "id" },
    },
    totalEarnings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Earnings",
    timestamps: true,
  }
);

// Associations with Users and Courses
Earning.associate = (models) => {
  // Earning has a foreign key relationship with User (creator)
  Earning.belongsTo(models.User, {
    foreignKey: "creatorId",
    as: "creator",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Earning has a foreign key relationship with Course
  Earning.belongsTo(models.Course, {
    foreignKey: "courseId",
    as: "course",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = Earning;
