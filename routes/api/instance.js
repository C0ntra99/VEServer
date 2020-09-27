const express = require('express');
const router = express.Router();
const Instance_helper = require('../helpers/Instance_helper')

const Helper = new Instance_helper

router.get('/', async (req, res) => {
    let result = await Helper.getInstance(req.query);
    return res.json(result)
});

router.post('/', async (req, res) => {
    let result = await Helper.create_new_instance(req);
    return res.json(result)
})

module.exports = router;