const models = require('../model');

module.exports = {
  test: (req, res) => {
    models.reviews.test((err, testResult) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(testResult);
      }
    });
  },

  getReviews: (req, res) => {
    models.reviews.readReviews(req.query, (err, reviewResults) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(reviewResults);
      }
    });
  },

  getReviewMetadata: (req, res) => {
    models.reviews.readReviewMetadata(req.query, (err, reviewMetadata) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(reviewMetadata);
      }
    });
  }
}
