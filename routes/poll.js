const express = require('express') ;
const router = express.Router() ;
const Pusher = require('pusher') ;
const mongoose = require('mongoose') ;
let Vote = require('../models/pollsModel') ;

var pusher = new Pusher({
    appId: '571962',
    key: 'e5e9f33d0e9cae96e992',
    secret: '19bf689aa7e5a989a3a3',
    cluster: 'us2',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => res.json({
        success: true,
        votes: votes
    })) ;
}) ;

router.post('/', (req, res) => {
    const newVote = {
        points: 1,
        party: req.body.party
    }
    new Vote(newVote).save().then(vote => {
        pusher.trigger('party-poll', 'party-vote', {
            points: parseInt(vote.points),
            party: vote.party
        }) ;

        return res.json({success: true, message: 'Thank you for your vote'}) ;
    }) ;
    /*
    const newVote = new Vote ({
        points: 1,
        party: req.body.party
    }) ;
    newVote.save().then(vote => {
        pusher.trigger('party-poll', 'party-vote', {
            points: parseInt(vote.points),
            party: vote.party
        }) ;

        return res.json({success: true, message: 'Thank you for your vote'}) ;
    })
    */
}) ;

module.exports = router ;
