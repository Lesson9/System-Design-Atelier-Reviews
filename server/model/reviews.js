const db = require('../db');

module.exports = {
  test: (callback) => {
    const queryStr = 'SELECT * FROM reviewphotos where id = 1';
    db.reviews.query(queryStr, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results.rows);
      }
    });
  },

  readReviews: ({ product_id, sort, count, page }, callback) => {
    let sortMethod = '';
    switch (sort) {
      case 'helpful':
        sortMethod = 'helpfulness DESC';
        break;
      case 'newest':
        sortMethod = 'date DESC';
        break;
      case 'relevant':
        sortMethod = 'id';
        break;
      default:
        sortMethod = 'id';
    }

    let countPerPage = count || 5;
    let currentPage = page || 1;

    const queryReview = `
      SELECT
        id AS review_id,
        rating,
        summary,
        recommend,
        (CASE WHEN response = 'null' THEN NULL ELSE response END) AS response,
        body,
        to_char(to_timestamp(CAST(date AS BIGINT) / 1000), 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as date,
        reviewer_name,
        helpfulness,
        COALESCE((SELECT
          json_agg(json_build_object('id', reviewphotos.id, 'url', reviewphotos.url))
            FROM reviewphotos
            WHERE tempreviews.id = reviewphotos.review_id
            ), '[]'::json) AS photos
      FROM tempreviews
      WHERE product_id = ${product_id} AND reported = false
      ORDER BY ${sortMethod};
    `;
    db.reviews.query(queryReview, (err, data) => {
      if (err) {
        callback(err);
      } else {
        const result = {};
        result.product = product_id;
        result.page = currentPage;
        result.count = countPerPage;
        result.results = data.rows.slice((currentPage - 1) * countPerPage, currentPage * countPerPage);
        callback(null, result);
      }
    });
  },

  readReviewMetadata: ({ product_id }, callback) => {
    const queryStr = `
    SELECT json_build_object(
      'product_id',
      CAST(${product_id} AS VARCHAR),
      'ratings',
      COALESCE((SELECT json_object_agg(allrating.rating, CAST(allrating.count AS VARCHAR)) FROM (
        SELECT rating, COUNT (rating)
        FROM (SELECT rating FROM tempreviews WHERE product_id = ${product_id}) as new
        GROUP BY new.rating
        ORDER BY new.rating
      ) AS allrating), '{}'::json),
      'recommended',
      COALESCE((SELECT
        json_object_agg(rc.recommend, CAST(rc.count AS VARCHAR))
      FROM (
        SELECT
          recommend, COUNT (recommend)
        FROM
          tempreviews
        WHERE
          product_id = ${product_id}
        GROUP BY
          tempreviews.recommend
      ) AS rc), '{}'::json),
      'characteristics',
        COALESCE((SELECT json_object_agg(kaka.name, json_build_object('id', kaka.id, 'value', CAST(kaka.avg AS VARCHAR)))
        FROM
        (SELECT
          id, name, AVG(value)
        FROM (
          SELECT
            characteristics.id, characteristics.name, characteristics_reviews.value
          FROM
            characteristics
          INNER JOIN
            characteristics_reviews
          ON
            characteristics.id = characteristics_reviews.characteristics_id
          WHERE
            characteristics.product_id = ${product_id}
          ORDER BY
            characteristics.id
        ) AS ta
        GROUP BY
          id, name) AS kaka), '{}'::json)
    )
    `;

    db.reviews.query(queryStr, (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, data.rows[0]['json_build_object']);
      }
    });
  }
}


