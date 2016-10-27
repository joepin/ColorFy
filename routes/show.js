const router = require('express').Router();

router.post('/', (req, res) => {
  res.json(req.body);
});

module.exports = router;
