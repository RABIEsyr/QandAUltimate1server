const mongoose = require("mongoose");
var deepPopulate = require("mongoose-deep-populate")(mongoose);

const schema = mongoose.Schema;



// const newQuestion = new schema(
//     {
//         question: String,
//         aA: String,
//         aB: String,
//         aC: String,
//         aD: String,
//         correct: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
//         category: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'category',
//              required: true
//           }
//     }
// );

const categorySchema = new schema(
    {
        name: {
            type: String,
            required: true
          },
    }
)

// // newQuestion.pre('save', async function (next) {
// //   if (!this.category) {
// //     const defaultCategory = await categorySchema.findOne({ name: 'منوع' });
// //     if (!defaultCategory) {
// //       const newDefaultCategory = new categorySchema({ name: 'منوع' });
// //       await newDefaultCategory.save();
// //       this.category = newDefaultCategory._id;
// //     } else {
// //       this.category = defaultCategory._id;
// //     }
// //   }
// //   next();
// // });
// module.exports.categorySchema = mongoose.model("category", categorySchema);
// module.exports.newQuestion = mongoose.model("new_question", newQuestion);

// newQuestion.pre('save', async function (next) {
//   if (!this.category) {
//     console.log('not catef')
//     const defaultCategory = await categorySchema.findOne({ name: 'منوع' });
//     if (!defaultCategory) {
//       const newDefaultCategory = new categorySchema({ name: 'منوع' });
//       await newDefaultCategory.save();
//       this.category = newDefaultCategory._id;
//     } else {
//       console.log('categ exists')
//       this.category = defaultCategory._id;
//     }
//   }
//   next();
// });
// categorySchema.pre('remove', async function (next) {
//   await Question.deleteMany({ category: this._id });
//   next();
// });

const newQuestion = new schema({
  question: String,
  aA: String,
  aB: String,
  aC: String,
  aD: String,
  correct: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
});

const Category = mongoose.model('category', categorySchema);

newQuestion.pre('save', async function (next) {
  if (!this.category) {
    const defaultCategory = await Category.findOne({ name: 'منوع' });
    if (!defaultCategory) {
      const newDefaultCategory = new Category({ name: 'منوع' });
      await newDefaultCategory.save();
      this.category = newDefaultCategory._id;
    } else {
      this.category = defaultCategory._id;
    }
  }
  next();
});

const NewQuestion = mongoose.model('new_question', newQuestion);

module.exports.categorySchema = Category
module.exports.newQuestion = NewQuestion;


