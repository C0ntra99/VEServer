const express = require('express');
const router = express.Router();
const Instance_helper = require('../helpers/Instance_helper')

const Helper = new Instance_helper

//Need to add route to get score of an instance
//Minimize VEClient workload
router.get('/', async (req, res) => {
    let result = await Helper.getInstance(req.query);
    return res.json(result)
});

router.post('/', async (req, res) => {
    let result = await Helper.create_new_instance(req);
    return res.json(result)
})

router.get('/:uid/stop', async (req, res) => {
    let result = await Helper.stopInstance(req.params)
    return res.json(result)
})
module.exports = router;