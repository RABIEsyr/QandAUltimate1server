const express = require('express');
const router = express.Router();

const db = require('../../db/db');

// const config = require('../../config/configQuizSize.json')
const fs = require('fs');




router.post('/addQ', (req, res) => {
  try {
    const question = req.body.question;
    const answerA = req.body.aA;
    const answerB = req.body.aB;
    const answerC = req.body.aC;
    const answerD = req.body.aD;
    const correct = req.body.correct;
    const categoryId = req.body.categoryid
     
    if (question && answerA && answerB && answerC && answerD && isInLetter(correct)) {
      console.log('rr, ', question, answerA, answerB, answerC, answerD, correct)
      const newQ = new db.newQuestion();
      newQ.question = question;
      newQ.aA = answerA.text;
      newQ.aB = answerB.text;
      newQ.aC = answerC.text;
      newQ.aD = answerD.text;
      newQ.correct = correct;
      
      if (categoryId) {
       
        newQ.category = categoryId;
      }
      newQ.save((err, doc) => {
        if (err) {
          console.log('the err,', err), 
          res.json({
            success: false,
            message: 'my database error'
          })
        } else {
          res.json({
            success: true,
            message: 'the question added'
          })
        }
      });
    } else {
      res.json({
        success: false,
        message: 'provide all fields'
      });
    }
  } catch (error) {
    console.log('err0', error)
    res.json({
      success: false,
      message: 'my error 0'
    });
  }
});

router.post('/get-questions-list-all', (req, res) => {
  // db.newQuestion.find().then((d) => {
  //   if (d) {
  //     res.json({
  //       success: true,
  //       questions: d
  //     });   
  // }
  // }).catch((e) => {
  //   res.json({
  //     success: false,
  //     message: 'my database error'
  //   })
  // });
  
  // const catID = req.body.categId
  // console.log('cattttttt', catID)
  // db.newQuestion.find({category: catID}).then((d) => {
  //             if (d) {
  //               console.log('dddd', d)
  //               res.json({
  //                 success: true,
  //                 questions: d
  //               });
  //           }
  //           }).catch((e) => {
  //             res.json({
  //               success: false,
  //               message: 'my database error998877'
  //             })
  //           });

   const catID = req.body.categId
 if (catID) {
  db.categorySchema.findById(catID)
  .then((d) => {
    if (d) {
      if (d.name == 'منوع') {
        console.log('eee', d)
        db.newQuestion.find({ $or: [{ category: { $exists: false } }, { category: catID }] }, function(err, questions) {
          if (err) {
            console.log(err);
          } else {
            res.json({
              success: true,
              questions: questions
            }); 
          }
        });
      } else {
        db.newQuestion.find({category: catID}).then((d2) => {
          if (d2) {
            console.log('dddd2222', d2)
            res.json({
              success: true,
              questions: d2
            });
        }
        }).catch((e) => {
          res.json({
            success: false,
            message: 'my database error998877'
          })
        });
      }
     
    }
  })
  .catch((e) => {
    console.log('errwww333', e)
  })
 }
});

// quiz questions
router.post('/get-questions-list', (req, res) => {
  const catID = req.body.categoryId

  db.categorySchema.findById(catID)
    .then((d) => {
      if (d) {
        if (d.name == 'منوع') {
          console.log('eee', d)
          db.newQuestion.find({ $or: [{ category: { $exists: false } }, { category: catID }] }, function(err, questions) {
            if (err) {
              console.log(err);
            } else {
              let arr = shuffle(questions)
              getSize(function(r) {
                console.log('here', r)
                arr = arr.slice(0, parseInt(r.size))
               
                res.json({
                  success: true,
                  questions: arr
                });
               })   
            }
          });
        } else {
          db.newQuestion.find({category: req.body.categoryId}).then((d) => {
            if (d) {
            let arr = shuffle(d)
            getSize(function(r) {
              console.log('here', r)
              arr = arr.slice(0, parseInt(r.size))
             
              res.json({
                success: true,
                questions: arr
              });
             })   
          }
          }).catch((e) => {
            res.json({
              success: false,
              message: 'my database error998877'
            })
          });
        }
       
      }
    })
    .catch((e) => {
      console.log('errwww333', e)
    })

 
});




router.post('/get-quiz-result', (req, res) => {
  let correctAnswers = 0;
  let incorrectAnswers = 0;
 try {
  const quizList = req.body.quiz;
 
  if (Array.isArray(quizList)) {
    // console.log(quizList)
    quizList.forEach(async(q) => {
    var doc = await  db.newQuestion.findById(q.id)
        console.log('result, s', doc)
        if (doc.correct == q.answer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
    })
    
  }
    setTimeout(() => {
      console.log('correct: ', correctAnswers);
      console.log('incorrect', incorrectAnswers)
      res.json({
        correct: correctAnswers,
        incorrect: incorrectAnswers
      })
    }, 1000)
  } catch (error) {
    console.log('myError rabie1', error)
  }
});


router.get('/questions-list-size', (req, res) => {
  db.newQuestion.find()
  .then((d) => {
    res.json({
      success: true,
      length: d.length
    })
  })
  .catch((e) => {
    res.json({
      success: false
    })
  })
});


router.get('/get-quiz-size', (req, res) => {
 getSize(function(r) {
  console.log('rrrrrrr', r)
  res.json({
    success: true,
    size: r
   });
 })
 
});

router.post('/set-quiz-size', (req, res) => {
  const newSize = req.body.quizSize;
  console.log('new new', newSize)
  setSize(newSize, function() {
res.json({
    success: true,
    size: newSize
  });
  })

  // res.json({
  //   success: true,
  //   size: file.size
  // });
});


router.post('/delete-question', (req, res) => {
  const id = req.body.id;

  db.newQuestion.findOneAndDelete({_id: id }, function (err, docs) {
    if (err){
        res.json({
          success: false,
          message: 'error while deleting'
        })
    }
    else{
      res.json({
        success: true,
        message: 'question deleted'
      })
    }
});
})


// Category Added
router.post('/new-category', (req, res) => {
  const categoryName = req.body.categoryName;
  if (categoryName) {
    try {
      db.categorySchema.findOne({name: categoryName}, (err, doc) => {
        if (err) {
          console.log('errr 999', err)
        } else {
          if (doc) {
            res.json({
              success: false,
              message: 'Category exists'
            })
          } else {
            const newCategory = new db.categorySchema();
            newCategory.name = categoryName;
            newCategory.save((err, categories) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'error 777 in database'
                })
              } else {
                res.json({
                  success: true,
                  message: 'Category Added sucessfully'
                })
              }
            })

          }
        }
        
      })
    } catch (error) {
      
    }
  }
});

router.get('/get-categories', (req, res) => {
  // db.categorySchema.find()
  //  .then((d) => {
  //   console.log('Categories list: ', d);
  //   res.json({
  //     success: true,
  //     categories: d
  //   })
  //  })
  //  .catch((e) => {
  //   res.json({
  //     success: false,
  //     message: 'internal error 678'
  //   })
  //  })


  db.categorySchema.find()
    .then(categories => {
      const promises = categories.map(category => {
        return db.newQuestion.countDocuments({ category: category._id })
          .then(count => {
            return { name: category.name, _id: category._id,  questionCount: count };
          });
      });
      Promise.all(promises)
        .then(results => {
          res.json({
            success: true,
            categories: results
          });
        })
        .catch(error => {
          res.json({
            success: false,
            message: 'internal error 678'
          });
          // res.status(500).json({ message: 'Internal server error' });
        });
    })
    .catch(error => {
      res.json({
        success: false,
        message: 'internal error 556'
      });
      // res.status(500).json({ message: 'Internal server error' });
    });
})


router.post('/delete-category', (req, res) => {
  console.log('iam here')
  try {
    if (req.body.catID) {
      console.log('will delete')
      db.categorySchema.findOneAndDelete({_id: req.body.catID})
        .then((e) => {
          db.newQuestion.deleteMany({ category: req.body.catID }, function(err) {
            if (err) {
              res.json({
                success: false,
                message: 'database error123321'
              })
              console.log(err);
            } else {
              res.json({
                success: true,
                message: 'category deleted successfully'
              })
              console.log('Questions deleted successfully.');
            }
          });

        })
        .catch((e) => {
          res.json({
            success: false,
            message: 'database error'
          })
        })
    }
  } catch (error) {
    
  }
})

function isInLetter(c) {
  if ( !( ['A', 'B', 'C', 'D'].includes(c))) {
    return false;
  }
  return true;
}


function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


var getSize = function(cb) { 
  fs.readFile('./configQuizSize.json', 'utf8', function(err, data) {
     if (err) cb({error: err});
     console.log(JSON.parse(data));
     cb(JSON.parse(data));
  });
};

var setSize = function(newSize, cb) { 
 const  size = {
    size: newSize
  }
  fs.writeFile('./configQuizSize.json', JSON.stringify(size), function writeJSON(err) {
    if (err) return console.log(err);
    // console.log(JSON.stringify(file));
    // console.log('writing to ' + fileName);
  });

  // fs.writeFile('./configQuizSize.json', 'utf8', function(err, data) {
  //    if (err) cb({error: err});
    
  //    cb(JSON.parse(data));
  // });
};
module.exports = router;

