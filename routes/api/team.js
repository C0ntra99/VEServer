const express = require('express');
const router = express.Router();
const Team_helper = require('../helpers/Team_helper')

const Helper = new Team_helper

router.get('/', async (req, res) => {
    let result = await Helper.getTeam();
    return res.json(result)
});

router.post('/', async (req, res) => {
   let result = await Helper.create_team(req);
   return res.json(result)
})

module.exports = router;