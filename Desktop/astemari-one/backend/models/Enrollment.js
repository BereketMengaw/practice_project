const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Enrollment extends Model {}

Enrollment.init(
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
  },
  {
    sequelize,
    modelName: "Enrollment",
    timestamps: true,
  }
);

module.exports = Enrollment;
