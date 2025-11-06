const express = require("express");
const controller = require('../controllers/Admins')

const router = express.Router();

router.get('/admins', controller.getAdminList);

router.post('/admins', controller.createAdmin);

router.get('/admin/:id(\\d+)', controller.getAdmin);

router.put('/admin/:id(\\d+)', controller.putAdmin);

router.patch('/admin/:id(\\d+)', controller.patchAdmin);

router.delete('/admin/:id(\\d+)', controller.deleteAdmin);

module.exports = router;