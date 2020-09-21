const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
   return res.json({staus:200, msg:"Hello World!"})
});

module.exports = router;