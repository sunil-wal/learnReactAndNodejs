const express = require('express');
const router = express.Router();

const light_controller = require('../controllers/light.controller');

router.get('/test', light_controller.test);
router.post('/create', light_controller.light_create);
router.get('/all', light_controller.light_all);
router.get('/report', light_controller.light_report);
router.get('/filter/:filterBy', light_controller.light_filter);
router.get('/:id', light_controller.light_details);
router.put('/:id/update', light_controller.light_update);

module.exports = router;