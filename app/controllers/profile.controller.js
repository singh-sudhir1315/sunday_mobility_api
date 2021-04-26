const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Astro = db.astro;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { astro } = require("../models");

exports.profileUpdate = (req, res) => {
  //Update the profile field:
    let updatedUser = {}
    updatedUser.username = req.body.username
    updatedUser.first_name = req.body.name
    updatedUser.email = req.body.email
    updatedUser.gender = req.body.gender
    updatedUser.dob = req.body.dob
    
    User.findOne({where: {username: req.body.username}})
    .then(record => {
      
      if (!record) {
        throw new Error('No record found')
      }
    
      console.log(`retrieved record ${JSON.stringify(record,null,2)}`) 
      
      let values = {
        registered : true,
        email: req.body.email,
        first_name: req.body.name,
        dob: req.body.dob,
        gender: req.body.gender
      }
      
      record.update(values).then( updatedRecord => {
        console.log("====>>>".updatedRecord);
        res.send({ 
          id: updatedRecord.id,
          username: updatedRecord.username,
          email: updatedRecord.email,
          name: updatedRecord.first_name,
          mobile: updatedRecord.mobile,
          dob: updatedRecord.dob,
          dob: updatedRecord.gender
         });
        //console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
        // login into your DB and confirm update
      })
    
    })
    .catch((error) => {
      // do seomthing with the error
      throw new Error(error)
    })
      
};

exports.userBoard = (req, res) => {
  Astro.findOne({
    where: {
      profile_verified: 1
    }
  })
  .then(astro => {
    res.status(200).send({
      id: astro.id,
      username: astro.username,
      email: astro.email,
      first_name: astro.first_name,
      last_name: astro.last_name,
      mobile: astro.mobile,
      language: astro.language,
      about: astro.about,
      experience: astro.experience,
      accessToken: token
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};