const express = require('express');
const router = express.Router();
const Song = require('../models/Song.js');
const ensureLoggedIn = require('../middleware/ensureLoggedIn.js');

// Paths start with /songs

// View all requestes functionality.
router.get('/', async (req, res) => {
    try {
        const allSongs = await Song.find({}).populate('user', 'name');
        res.render('songs/index.ejs', { songs: allSongs, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching songs');
    }
});


// Return view (form) to add a new song request.
router.get('/new', ensureLoggedIn, (req, res) => {
    res.render('songs/new.ejs');
});

// CREATE Functionality.
router.post('/', ensureLoggedIn, async (req, res) => {
    try {
        const newSong = new Song({
            title: req.body.title,
            artist: req.body.artist,
            youTubeURL: req.body.youTubeURL,
            user: req.user._id,
        });
        
        await newSong.save();
        
        res.redirect('/songs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Oops, Fumble! We han an error creating your song. Please refresh and try again! 🙏');
    }
});

// GET /songs/:songId/edit - Display form to edit a song
router.get('/:songId/edit', ensureLoggedIn, async (req, res) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (song.user.equals(req.user._id)) {  // Only the owner of the song can edit.
            res.render('songs/edit.ejs', { song });
        } else {
            res.send('You are not authorized to edit this song!');
        }
    } catch (error) {
        console.error(error);
        res.send('Error loading the edit form. Please refresh and try again.');
    }
});


// PUT /songs/:songId - Handle the edit form submission
router.put('/:songId', ensureLoggedIn, async (req, res) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (song.user.equals(req.user._id)) {  // Ensure the user owns this song
            await Song.findByIdAndUpdate(req.params.songId, req.body);
            res.redirect(`/songs/${req.params.songId}`);
        } else {
            res.send('You are not authorized to update this song!');
        }
    } catch (error) {
        console.error(error);
        res.send("Oops! There's been an error updating your song", error);
    }
});

// GET /:songId - SHOW functionality
router.get('/:songId', ensureLoggedIn, async (req, res) => { 
        const song = await Song.findById(req.params.songId);
        if (song.user.equals(req.user._id)) {  // Ensure the user owns this song
            res.render('songs/show.ejs', { song });
        } else {
            res.send('What are you doing here? You are not authorized to view this song! 😡');
        }
});





// DELETE song functinality.
router.delete('/:songId', ensureLoggedIn, async (req, res) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (song.user.equals(req.user._id)) {  // Verifying if the user owns this song.
            await Song.findByIdAndDelete(req.params.songId);
            res.redirect('/songs');
        } else {
            res.send('You are not authorized to delete this song!');
        }
    } catch (error) {
        console.error(error);
        res.send('Oops! There has been an error deleting song. Please refresh and try again 🙏.');
    }
});


module.exports = router;