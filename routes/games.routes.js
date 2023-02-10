const express = require('express');
const auth = require('../middleware/auth.middleware');
const Game = require('../models/Game');

const router = express.Router( { mergeParams: true });

router
    .route('/')
    .get(async(req, res) => {
        try {
            const { orderBy, equalTo } = req.query;
            const list = await Game.find({ [orderBy]: equalTo });
            res.send(list);
        } catch (error) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            });
        }
    })
    .post(auth, async(req, res) => {
        try {
            const newGame = await Game.create({
                ...req.body,
                userId: req.user._id
            });
            res.status(201).send(newGame);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            });
        }
    });

    router.delete('/:gameId', auth, async (req, res) => {
        try {
            const { gameId } = req.params;
            const removedComment = await Comment.findById(gameId);
            if (removedComment.userId.toString() === req.user._id) {
                await removedComment.remove();
                return res.send(null);
            } else {
                return res.status(401).json({ message: "Unauthorized" })
            };
        } catch (error) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            });
        };
    });

    router.patch('/:gameId', auth, async (req, res) => {
        try {
            const { gameId } = req.params;
            const updatedGame = await Game.findById(gameId);
            if (auth.user._id === updatedGame.authorId) {
                await Game.updateOne(updatedGame, req.body, { new: true });
                const editedGame = await Game.findById(gameId);
                res.send(editedGame);
            } else {
                res.status(401).json({ message: "Unauthorized" })
            };
        } catch (error) {
            res.status(500).json({
                message: 'На сервере произошла ошибка. Попробуйте позже'
            });
        };
    });

module.exports = router;