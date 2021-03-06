const Paws = require('./model');
const {hashPassword, checkPassword, genToken} = require('./auth.js')

const controller = {};

controller.login = async (req, res) => {
  const { pw, email } = req.body;

  try {    
    const data = await Paws.findUser(email)
    
    const passwordIsCorrect = await checkPassword(pw, data.password)    
    if(passwordIsCorrect) {
        const token = await genToken(data)
        res.json({
          data: data,
          token: token
        })
      } else {
        res.status(500).json({ err })
      }
    }
    catch(err) {
      res.status(500).json({ err })
    };
};

controller.createUser = async (req, res) => {
  const { email, name, password, city, avatar } = req.body;
  
  const password_digest = await hashPassword(password);
  
  Paws.createUser({
    email,
    name,
    password: password_digest,
    city,
    avatar
  })
   .then( data => {
      res.json({
        message: 'created',
        data: data
      });
    })
    .catch(err => {
      res.status(500).json({ err })
    });
}

controller.changePW = async (req, res) => {  
  const { password } = req.body
  const id = req.params.id
  
  const password_digest = await hashPassword(password);
  
  Paws.changePW(password_digest, id)
   .then( data => {
      res.json({
        message: 'changed',
        data: data
      });
    })
    .catch(err => {
      res.status(500).json({ err })
    });
}

controller.getFeed = async (req, res) => {

  try {    
    const data = await Paws.getFeed()
      res.json({
        data: data
      })      
  }

  catch(err) {
    res.status(500).json({ err });
  }
}

controller.getMyPosts = async (req, res) => {
  const id = req.params.id

  try {    
    const data = await Paws.getMyPosts(id)
      res.json({
        data: data
      })      
  }

  catch(err) {
    res.status(500).json({ err });
  }
};

controller.getPostInfo = async (req, res) => {
  const id = req.params.id

  try {
    const data = await Paws.getPostInfo(id)
      res.json({
        data: data
      })
  }

  catch(err) {
    res.status(500).json({ err });
  } 
}

controller.getUserBookmarks = async (req, res) => {
  const id = req.params.id

  try {
    const data = await Paws.getUserBookmarks(id)
      res.json({
        data: data
      })
  }

  catch(err) {
    res.status(500).json({ err })
  } 
}

controller.addBookmark = async (req, res) => {
  const user_id = req.params.id
  const {post_id} = req.body  

  try {
    const data = await Paws.addBookmark(post_id, user_id)    
      res.json({
        data: data
      })
  }

  catch(err) {
    res.status(500).json({ err })
  } 
}

controller.removeBookmark = async (req, res) => {
  const {post_id, user_id} = req.body

  try {
    const data = await Paws.removeBookmark(post_id, user_id)
      res.json({
        data: data,
        message: 'deleted'
      })
  }

  catch(err) {
    res.status(500).json({ err })
  } 
}

module.exports = controller;