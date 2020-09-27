const express = require('express');
const router = express.Router();
const Round_helper = require('../helpers/Round_helper')

const Helper = new Round_helper

router.get('/', async (req, res) => {
    let result = await Helper.getRound(req.query);
    return res.json(result)
});

router.post('/', async (req, res) => {
    let result = await Helper.makeRound(req)
    return res.json(result)
})

router.get('/:name/start', async (req, res) => {
    let result = await Helper.startRound(req.params)
    return res.json(result)
})

router.get('/:name/stop', async (req, res) => {
    let result = await Helper.stopRound(req.params)
    return res.json(result)
})
module.exports = router;