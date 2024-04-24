var express = require('express');
// 建立一個新的路由object來處理路由
var router = express.Router();
//模組化的Post model，習慣上model會用大寫
const Post = require("../models/postsModels");

// 設置路由器以取得所有貼文
router.get('/', async function(req, res, next) {
    try{
        // 等待資料庫回傳結果，因為這是一個異步操作，會返回promise，所以需要加await
        const posts = await Post.find();
        res.status(200).json({
        posts
    });
    }
    catch(error){
        res.status(500).json({
            "status":"false",
            "message":error
        })
    }
});

// 設置路由器以新增一筆貼文
router.post('/', async function(req, res, next) {
    try{
        // 新增資料 (透過create方法，較直覺，這是mongoose優化的作法)
        // 創建實例並保存到資料庫的過程，因為這是一個異步操作，會返回promise，所以需要加await
        const newPost = await Post.create(req.body);
        res.status(201).json({
        "message":"新增成功",
        posts:newPost
    })
    }
    catch(error){
        res.status(400).json({
            "status":"false",
            "message":error
        })
    }
});

// 設置路由器以刪除所有貼文
router.delete('/', async function(req, res, next) {
    try{
        // 等待資料庫刪除完成，因為這是一個異步操作，會返回promise，所以需要加await
        await Post.deleteMany({});
        const posts = await Post.find();
        res.status(200).json({
            "status":"success",
            posts
        })
    }
    catch(error){
        res.status(500).json({
            "status":"false",
            "message":error
        })
    }
});

// 設置路由器以刪除一筆貼文
router.delete('/:id', async function(req, res, next) {
    try{
        const id = req.params.id;
        // 等待資料庫刪除完成，因為這是一個異步操作，會返回promise，所以需要加await
        const searchResult = await Post.findByIdAndDelete(id);
        if(!searchResult){
            res.status(404).json({
                "status":"false",
                "message":"無此 post ID"
            })
        }
        else{
            res.status(200).json({
                "status":"success",
                data:null
            })
        }
    }
    catch(error){
        res.status(400).json({
            "status":"false",
            "message":"post ID格式不正確"
        })
    }
});

// 設置路由器以更新一筆貼文
router.patch('/:id', async function(req, res, next) {
    try{
        const data = req.body;
        const id = req.params.id;
        // 等待資料庫更新資料，因為這是一個異步操作，會返回promise，所以需要加await
        const searchResult = await Post.findByIdAndUpdate(id, data);
        if(!searchResult){
            res.status(404).json({
                "status":"false",
                "message":"無此 post ID"
            })
        }
        else{
            // 等待資料庫回傳結果，因為這是一個異步操作，會返回promise，所以需要加await
            const updatedPost = await Post.findById(id);
            res.status(200).json({
                "status":"success",
                updatedPost
            })
        }
    }
    catch(error){
        res.status(400).json({
            "status":"false",
            "message":"post ID格式不正確"
        })
    }
    
});

module.exports = router;