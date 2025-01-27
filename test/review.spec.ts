import { Review } from "../src/interface/review/review"

const app = require('../app')
const request = require('supertest')
const s3=require('../src/util/s3');
/**리뷰 입력 시 ...  id는 식당 id */
describe('review',function(){
describe.only('post /review/:id',function() {
    let testData : Review = {
        review : '맛있어요',
        star : 5,
    }

    describe('성공 시',() => {
        it('201로 응답한다',(done) => {
            request(app)
                .post('/review/2973')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .expect(201)
                .end(done);
        });
    });
    describe('성공 시2',async() => {
        let testData2:any;
        before(async () => {
            testData2 = {
                review: '맛있어요',
                star: 2,
                img: [`${await s3.generateUploadURL()}`, `${await s3.generateUploadURL()}`]
            };
        });
    
        it('201로 응답한다', (done) => {
            request(app)
                .post('/review/1804')
                .set("authorization", "Bearer testtoken")
                .send(testData2)
                .expect(201)
                .end((err:any, res:any) => {
                    done();
                });
        });
    });
    describe('실패 시',() => {
        it('찾을 수 없는 id일시 404로 응답',(done) => {
            request(app)
                .post('/review/70000000')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .expect(404)
                .end(done);
        });

        it('입력 값이 잘못 되었을 경우 400으로 응답',(done) => {
            let wrongData = {
                review: '맛있어요',
                star :'2'
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });

        it('입력 값이 누락 되었을 경우 400으로 응답',(done) => {
            let wrongData = {
                review: '맛있어요',
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });

        it('다른 입력 값이 들어왔을 경우 400으로 응답', (done) => {
            let wrongData = {
                review : '맛있어요',
                star : 2,
                name : 'giwon'
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });

        it('로그인이 안되어 있을 시 401로 응답', (done) => {
            request(app)
                .post('/review/1804')
                .send(testData)
                .expect(401)
                .end(done);
        });
    });

});


/**리뷰 수정 시  id는 리뷰*/
describe('patch /review/update/:id',function () {
    describe('성공 시',() => {
        let testData : Review = {
            review : '맛있어요!!',
            star : 2,
        }

        let body : any;
        before(done => {
            request(app)
                .patch('/review/update/1')
                .set("authorization","Bearer testtoken")
                .send(testData)
                .end((err:any,res:any) => {
                    body = res.body;
                    console.log(body);
                    done();
                });
        });

        it('review가 포함 되어야 한다.',async () => {
            body.should.have.property('review');
        });

        it('review는 string이여야 한다.', async () => {
            body.review.should.be.instanceOf(String);
        });

        it('star가 포함되어야 한다.',async () => {
            body.should.have.property('star');
        });

        it('star는 number여야 한다.', async () => {
            body.star.should.be.instanceOf(Number);
        });

        it('reviewImgs이 포함되어야 한다.',async () => {
            body.should.have.property('reviewImgs');
        });

        it('reviewImgs은 배열이여야 한다.', async () => {
            body.reviewImgs.should.be.instanceOf(Array); //이거 통과 안되면 그냥 Array로
        });

        it('user가 포함되어야 한다.',async () => {
            body.should.have.property('user');
        });

        it('user.userNickName가 포함되어야 한다.',async () => {
            body.user.should.have.property('userNickName');
        });

        it('user.userNickName는 string여야 한다.', async () => {
            body.user.userNickName.should.be.instanceOf(String);
        });

        it('user.id가 포함되어야 한다.',async () => {
            body.user.should.have.property('id');
        });

        it('user.id는 number여야 한다.', async () => {
            body.user.id.should.be.instanceOf(Number);
        });
    });
    describe('성공 시2',async() => {
        let testData2:any;
        before(async () => {
            testData2 = {
                review: '맛있어요',
                star: 2,
                insertImg: [await s3.generateUploadURL(), await s3.generateUploadURL()],
                deleteImg:[]
            };
        });
    
        it('200로 응답한다', (done) => {
            request(app)
            .patch('/review/update/1')
                .set("authorization", "Bearer testtoken")
                .send(testData2)
                .expect(200)
                .end((err:any, res:any) => {
                    done();
                });
        });
    });
    describe('실패 시 ',() => {
        it('입력이 잘못 되었을 시 400을 응답한다.',(done) =>{
            let wrongData = {
                review: '맛있어요',
                star :'2'
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });

        
        it('다른 입력 값이 들어왔을 경우 400으로 응답', (done) => {
            let wrongData = {
                review : '맛있어요',
                star : 2,
                name : 'giwon'
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });

       
        it('입력 값이 누락 되었을 경우 400으로 응답',(done) => {
            let wrongData = {
                review: '맛있어요',
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer testtoken")
                .send(wrongData)
                .expect(400)
                .end(done);
        });


        it('로그인이 안되어 있을 시 401로 응답', (done) => {
            let testData : Review = {
                review : '맛있어요',
                star : 2,
            }

            request(app)
                .post('/review/1804')
                .send(testData)
                .expect(401)
                .end(done);
        });

        it('리뷰 작성자가 아닐 시 403로 응답',(done) => {
            let testData : Review = {
                review : '맛있어요',
                star : 2,
            }

            request(app)
                .post('/review/1804')
                .set("authorization","Bearer ownertoken")
                .send(testData)
                .expect(403)
                .end(done);
        });

    });
});

/**리뷰 조회 시 id는 리뷰 id */
describe('get /review/:id ',function() {
    describe('성공 시 해당 리뷰 리턴',() => {
        let body : any;
        before(done => {
            request(app)
                .get('/review/3')
                .expect(200)
                .end((err:any, res:any) => {
                    body = res.body.data;
                    done();
                });
        });

        it('review가 포함 되어야 한다.',async () => {
            body.should.have.property('review');
        });

        it('review는 string이여야 한다.', async () => {
            body.review.should.be.instanceOf(String);
        });

        it('star가 포함되어야 한다.',async () => {
            body.should.have.property('star');
        });

        it('star는 number여야 한다.', async () => {
            body.star.should.be.instanceOf(Number);
        });

        it('reviewImgs이 포함되어야 한다.',async () => {
            body.should.have.property('reviewImgs');
        });

        it('reviewImgs은 배열이여야 한다.', async () => {
            body.reviewImgs.should.be.instanceOf(Array<string>); //이거 통과 안되면 그냥 Array로
        });

        it('user가 포함되어야 한다.',async () => {
            body.should.have.property('user');
        });

        it('user.userNickName가 포함되어야 한다.',async () => {
            body.user.should.have.property('userNickName');
        });

        it('user.userNickName는 string여야 한다.', async () => {
            body.user.userNickName.should.be.instanceOf(String);
        });

        it('user.id가 포함되어야 한다.',async () => {
            body.user.should.have.property('id');
        });

        it('user.id는 number여야 한다.', async () => {
            body.user.id.should.be.instanceOf(Number);
        });

        it('reviewComments가 포함되어야 한다.',async () => {
            body.should.have.property('reviewComments');
        })

        it('reviewComments는 Array여야 한다',async () => {
            body.reviewComments.should.be.instanceOf(Array);
        });
    });

    describe('실패 시',() => {
        it('없는 리뷰 조회 시 404로 응답한다',(done) => {
            request(app)
                .get('/review/0')
                .expect(404)
                .end((err:any, res:any) => {
                    done();
                });
        });

        it('잘못된 파라미터일 시 400으로 응답한다',(done) => {
            request(app)
                .get('/review/sigdang')
                .expect(400)
                .end((err:any, res:any) => {
                    done();
                });
        });

    });
});


/**리뷰 리스트 조회 시  id는 식당 id*/
describe('get /review/list/:id',() => {
    describe('성공 시',() => {
        let body:any;
        before(done => {
            request(app)
            .get('/review/list/1804')
            .expect(200)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });


        it('review 리스트 조회',async () => {
            body.should.be.instanceOf(Array);
        });

        it('reviewImgs 을 포함해야 한다.',async () => {
            body[0].should.have.property('reviewImgs');
        });

        it('reviewImgs은 배열이여야 한다.',async () => {
            body[0].reviewImgs.should.be.instanceOf(Array);
        });

        it('reviewComments 을 포함해야 한다.',async () => {
            body[0].should.have.property('reviewComments');
        });

        it('reviewComments 배열이여야 한다.',async () => {
            body[0].reviewComments.should.be.instanceOf(Array);
        });
    });

    describe('실패 시',() =>{
        it('없는 식당 조회 시 404로 응답한다',(done) => {
            request(app)
                .get('review/list/0')
                .expect(404)
                .end((err:any, res:any) => {
                    done();
                });
        });

        it('잘못된 파라미터일 시 400으로 응답한다',(done) => {
            request(app)
                .get('review/list/sigdang')
                .expect(400)
                .end((err:any, res:any) => {
                    done();
                });
        });
    });
});

/**유저 별 리뷰 리스트 조회*/
describe('get /review/user/list',() => {
    describe('성공 시',() => {
        let body:any;
        before(done => {
            request(app)
            .get('/review/user/list')
            .set("authorization","Bearer testtoken")
            .expect(200)
            .end((err:any,res:any) => {
                body = res.body;
                console.log(body);
                done();
            });
        });


        it('review 리스트 조회',async () => {
            body.should.be.instanceOf(Array);
        });

        it('reviewImgs 을 포함해야 한다.',async () => {
            body[0].should.have.property('reviewImgs');
        });

        it('reviewImgs은 배열이여야 한다.',async () => {
            body[0].reviewImgs.should.be.instanceOf(Array);
        });

        it('id을 포함해야 한다.',async () => {
            body[0].should.have.property('id');
        });

        it('id은 number이여야 한다.',async () => {
            body[0].id.should.be.instanceOf(Number);
        });

        it('review 을 포함해야 한다.',async () => {
            body[0].should.have.property('review');
        });

        it('review은 String이여야 한다.',async () => {
            body[0].review.should.be.instanceOf(String);
        });

        it('star 을 포함해야 한다.',async () => {
            body[0].should.have.property('star');
        });

        it('star은 숫자이여야 한다.',async () => {
            body[0].star.should.be.instanceOf(Number);
        });

        it('hansics 을 포함해야 한다.',async () => {
            body[0].should.have.property('hansics');
        });

               
    });

    describe('실패 시',() =>{
        it('로그인이 안되어 있을 시 401으로 응답한다',(done) => {
            request(app)
                .get('review/list/sigdang')
                .expect(401)
                .end((err:any, res:any) => {
                    done();
                });
        });
    });
});


//리뷰 댓글 입력시
/*
로그인 필요
string commen,reviewId만 있으면됨.
*/
describe('post /review/comment/:id',() => {
    describe('성공 시',() => {
        let body:any;
        let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
        it('성공시',done => {
            request(app)
            .post('/review/comment/1')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(201)
            .end((err:any,res:any) => {
                body = res.body;
                console.log(res.status);
                done();
            });
        });
        
    });
    describe('실패 시',() =>{
        it('로그인이 안되어있을시 401로 응답한다.',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .post('/review/comment/1')
            .send(data)
            .expect(401)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });

        it('찾을수 없는 id일시 404으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .post('/review/comment/10700')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(404)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('다른 입력 값이 들어왔을경우 400으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .post('/review/comment/서울')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('입력값(comment)이 누락되었을경우 400으로 응답한다',(done) => {
            let data="";
            let body;
            request(app)
            .post('/review/comment/1')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('입력값(id)이 누락되었을경우 400으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .post('/review/comment/')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        
    });
});
describe('post /review/update/:id',() => {
    describe('성공 시',() => {
        let body:any;
        let data:any={comment:"리뷰를 믿지마 유튜브를 믿어"};
        it('성공시',done => {
            request(app)
            .patch('/review/comment/1')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(201)
            .end((err:any,res:any) => {
                body = res.body;
                console.log(res.status);
                done();
            });
        });
        
    });
    describe('실패 시',() =>{
        it('로그인이 안되어있을시 401로 응답한다.',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .patch('/review/comment/1')
            .send(data)
            .expect(401)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });

        it('찾을수 없는 id일시 404으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .patch('/review/comment/10700')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(404)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('다른 입력 값이 들어왔을경우 400으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .patch('/review/comment/서울')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('입력값(comment)이 누락되었을경우 400으로 응답한다',(done) => {
            let data="";
            let body;
            request(app)
            .patch('/review/comment/1')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        it('입력값(id)이 누락되었을경우 400으로 응답한다',(done) => {
            let data:any={comment:"유튜브를 믿지마 리뷰를 믿어"};
            let body;
            request(app)
            .patch('/review/comment/')
            .set("authorization","Bearer testtoken")
            .send(data)
            .expect(400)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        
    });
});
//리뷰 코멘트 삭제시
describe('delete /review/comment/:id',() => {
    describe('실패 시',() =>{
        it('권한이 없을 시 403로 응답한다.',(done) => {
            let body;
            request(app)
            .delete('/review/comment/1')
            .expect(403)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });

        it('찾을수 없는 id일시 404으로 응답한다',(done) => {
            let body;
            request(app)
            .delete('/review/comment/10700')
            .set("authorization","Bearer testtoken")
            .expect(404)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
        
    });
    describe('성공 시',() => {
        let body:any;
        before(done => {
            request(app)
            .delete('/review/comment/1')
            .set("authorization","Bearer testtoken")
            .expect(204)
            .end((err:any,res:any) => {
                body = res.body;
                done();
            });
        });
    });
    
});
//리뷰 삭제 시
describe('delete reivew/:id',() => {
    

    describe('fail..',() => {
        it('없는 id일 시 404로 응답한다',(done) => {
            request(app)
                .delete('/review/0')
                .set("authorization","Bearer testtoken")
                .expect(404)
                .end(done);
        });

        it('리뷰 작성자가 아닐 시 403로 응답한다.',(done) => {
            request(app)
                .delete('/review/3')
                .set("authorization","Bearer ownertoken")
                .expect(403)
                .end(done);
        });
    });
    describe('success', () => {
        it('204로 응답',(done) => {
            request(app)
                .delete('/review/3')
                .set("authorization","Bearer testtoken")
                .expect(204)
                .end(done);
        });
    });
    after(done=>
        {
            request(app)
            .delete('/review/-3')
            .set("authorization","Bearer testtoken")
            .expect(204)
            .end(done);
        })
})

});