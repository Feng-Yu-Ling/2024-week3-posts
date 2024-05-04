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
        // 在express若不指定狀態碼，預設是200，所以可以省略status(200)
        res.json({
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
        // 使用req.originalUrl確保不是無意中匹配到此路由，記得要寫完整路由
        if(req.originalUrl === "/posts"){
            // 等待資料庫刪除完成，因為這是一個異步操作，會返回promise，所以需要加await
            await Post.deleteMany({});
            const posts = await Post.find();
            // 在express若不指定狀態碼，預設是200，所以可以省略status(200)
            res.json({
                "status":"success",
                posts
        })
        }
        else{
            res.status(400).json({
                "status":"false",
                "message":"刪除全部的路由為'posts'而不是'posts/'，這是避免刪除單筆的錯誤操作"
            })
        }
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
            // 在express若不指定狀態碼，預設是200，所以可以省略status(200)
            res.json({
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
        // 在findByIdAndUpdate()加入第三個參數 {runValidators:true}讓它也執行Schema驗證
        // 在findByIdAndUpdate()加入第三個參數 {new:true}讓他回傳更新後的document而不是原始document
        const updatePost = await Post.findByIdAndUpdate(id, data, {runValidators:true, new:true});
        if(!updatePost){
            res.status(404).json({
                "status":"false",
                "message":"無此 post ID"
            })
        }
        else{
            // 在express若不指定狀態碼，預設是200，所以可以省略status(200)
            res.json({
                "status":"success",
                updatePost
            })
        }
    }
    catch(error){
        res.status(400).json({
            "status":"false",
            "message":"post ID格式不正確或content為null"
        })
    }
    
});

module.exports = router;