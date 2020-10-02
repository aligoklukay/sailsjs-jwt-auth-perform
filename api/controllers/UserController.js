/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var { userSchema } = require("../validations/user");
var bcrypt = require('bcrypt');

userSchema;

module.exports = {
  /**
   * `UserController.signup()`
   */
  signup: async function (req, res) {
    try {
      var values = req.allParams();

      //Validate email and password
      userSchema
        .isValid(values)
        .then(async function () {
          let user = await User.create({
            email: values.email,
            password: values.password,
          }).fetch();

          return res.json({
            user,
          });
        })
        .catch(function (err) {
          if (err.code == "E_UNIQUE") {
            return res.json({
              status: false,
              message: `Hata!Bu email adresi sistemde kayıtlıdır.`,
            });
          } else {
            return res.json(err);
          }
        });
    } catch (error) {
      return res.serverError(error);
    }
  },

  /**
   * `UserController.login()`
   */
  login: async function (req, res) {
    try {
      var values = req.allParams();

      //Validate email and password
      userSchema
        .isValid(values)
        .then(async function () {
          let user = await User.findOne({
            email:values.email,
          });

          if(!user){
            return res.notFound({err: 'Böyle bir kullanıcı bulunmamaktadır.'})
          }

          const matchedPassword = bcrypt.compareSync(values.password, user.password);

          if(!matchedPassword){
            return res.badRequest({err: 'Yetkisiz.'})
          }

          const token = jwt.issuer({user: user.id}, '90 day');

          return res.json({
            user,
            token
          });
        })
        .catch(function (err) {



        });
    } catch (error) {
      return res.serverError(error);
    }
  },
};
