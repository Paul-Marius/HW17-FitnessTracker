const router = require("express").Router();
const Workout = require("../models/workout.js");

router.get("/api/workouts", (req, res) => {
  Workout.aggregate([{ $addFields: { totalDuration: { $sum: "exercises.duration" } } }])
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      console.log(err)
      res.json(err);
    });
});

router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

router.put("/api/workouts/:id", (req, res) => {
  Workout.findByIdAndUpdate(
    { _id: req.params.id },
    {
      // $inc: { totalDuration: req.body.duration },
      $push: { exercises: req.body }
    }, { new: true }
  )
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: "$exercises.duration" }
      }
    },
    
  ]).sort({ day: "desc" })
    .limit(7)
    .sort({ day: "asc" })
    
    .then(dbWorkouts => {
      res.json(dbWorkouts);
    })
    .catch(err => {
      res.json(err);
    });
});

// router.delete("/api/workouts", ({ body }, res) => {
//   Workout.findByIdAndDelete(body.id)
//     .then(() => {
//       res.json(true);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

module.exports = router;
