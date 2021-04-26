const db = require("../models");
const config = require("../config/auth.config");
require("dotenv").config();//npm install dotenv
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");





exports.signup = (req, res) => {
  // Save User to Database
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
     
        User.create({
          name: req.body.name,
          mobile: req.body.mobile,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8)
        })
          .then(user => {
            if (req.body.roles) {
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: req.body.roles
                  }
                }
              }).then(roles => {
                user.setRoles(roles).then(() => {
                  res.send({ message: "User was registered successfully!" });
                });
              });
            } else {
              // user role = 1
              user.setRoles([1]).then(() => {
                res.send({ message: "User was registered successfully!" });
              });
            }
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
    
  });
};






exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Plase enter valid email" });
      }

      var passwordIsValid = (
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          email: user.email,
          name: user.name,
          mobile: user.mobile,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
    
};

exports.userList = (req, res) => {
  User.findAll({
    
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "No User Found" });
      }
      const data = user.map((user)=>{
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          createdAt: user.createdAt
        }
      })
        res.status(200).send({data});
      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
    
};

exports.deleteUser = (req, res) => {
  console.log("=>>==>>",req.body.id);
  User.destroy({
    where: {
      id: req.body.id
    }
  })
    .then(user => {
      if (user) {
        return res.status(200).send({ message: "User Deleted Successfully" });
      }
      return res.status(404).send({ message: "User Not Found" });
      
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
    
};