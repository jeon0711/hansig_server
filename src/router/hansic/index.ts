import express from "express";
const ctrl = require('./hansic.ctrl');
const softAuthJWT = require('../../middleware/softAuthJWT');
const authJWT = require('../../middleware/authJWT');
/*
ㄴ 리뷰 입력 시
ㄴ 리뷰 수정 시
ㄴ 리뷰 삭제 시
ㄴ 메뉴 입력 시
ㄴ 메뉴 수정 시
ㄴ 메뉴 삭제 시
ㄴ 리뷰 댓글 입력 시
ㄴ 리뷰 댓글 삭제 시
*/
const router = express.Router();
router.get('/place',softAuthJWT,ctrl.output.getByPlace);
router.get('/all/:sortOption',ctrl.output.getAll);//sortOption이 있으면 userStar로정렬,
router.get('/loc/:id/:sortOption',ctrl.output.getFromLocation);
router.get('/all',ctrl.output.getAll);
router.get('/loc/:id',ctrl.output.getFromLocation);
router.get('/get/geo',ctrl.output.tryGeo);
router.get('/:id',softAuthJWT,ctrl.output.get);
router.get('/star/user',authJWT,ctrl.output.favorite);

router.post('/star/:id',authJWT,ctrl.process.favorite);
router.post('/enroll',authJWT,ctrl.process.enrollHansic); //내가 아는 한식 뷔페 등록하기
// router.post('/:id',ctrl.process.create);
// router.patch('/:id',ctrl.process.update);
// router.delete('/:id',ctrl.process.delete);
// //menu
// router.get('/:id/menu',ctrl.output.menu.getAll);
// router.post('/:id/menu',ctrl.process.menu.create);
// router.patch('/:id/menu/:menuId',ctrl.process.menu.update);
// router.delete('/:id/menu',ctrl.process.menu.delete);
// router.get('/:id/menu/:menuId',ctrl.output.menu.get);
// //reviewcomment
// router.get('/:id/comment',ctrl.output.comment.getAll);
// router.post('/:id/comment',ctrl.process.comment.create);
// router.delete('/:id/comment',ctrl.process.comment.delete);

module.exports = router;
