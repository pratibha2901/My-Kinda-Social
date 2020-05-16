const { admin, db } = require("../util/admin");
const firebase = require("firebase");
const firebaseConfig = require("../util/config");
firebase.initializeApp(firebaseConfig);

const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validations");
// signup
exports.signup = (req, res) => {
  let _token;
  let _userId;
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };
  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }
  const blankImage = "blankImage.png";
  //check for the unique handle
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "Handle already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      _userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((token) => {
      _token = token;
      const newUserCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdOn: new Date().toISOString(),
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${blankImage}?alt=media`,
        _userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(newUserCredentials);
    })
    .then(() => {
      return res.status(201).json({ _token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code == "auth/email-already-in-use") {
        return res.status(409).json({ email: "email already exists" });
      } else {
        return res.status(500).json({ general: 'something went wrong! please try  again later' });
      }
    });
};
//log user in
exports.login = (req, res) => {
  const loginUser = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(loginUser);
  if (!valid) {
    return res.status(400).json({ errors });
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(loginUser.email, loginUser.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
     /* console.error(err);
      if (err.code === "auth/user-not-found") {*/
        return res
          .status(403)
          .json({ general: "Wrong credentials!!Please try again" });
      

      //return res.status(500).json({ err });
    });
};
// upload user image
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  let imgFileName;
  let imageToBeUploaded = {};

  const busboy = new BusBoy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "wrong file type uploaded" });
    }
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    const imgExtension = filename.split(".")[filename.split(".").length - 1];
    imgFileName = `${Math.round(Math.random() * 12345)}.${imgExtension}`;
    const filePath = path.join(os.tmpdir(), imgFileName);
    imageToBeUploaded = {
      filePath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imgFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageURL });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfuly" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
// Handler to add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfuly" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Handler to get current logged in user details

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db.collection('notifications')
      .where('recipient','==',req.user.handle)
      .orderBy('createdOn','desc')
      .limit(10)
      .get()
    //  return res.json({ userData });
    })
    .then((data)=>
    {
        userData.notifications=[];
        data.forEach(doc=>
            {
                userData.notifications.push({
                    ...doc.data(),
                    notificationId:doc.id
                });

            })
            return res.json({ userData });     
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};


exports.getAnyUserDetail=(req,res)=>
{
    let userData={};
    db.doc(`/users/${req.params.handle}`).get()
    .then((doc)=>
    {
        if(doc.exists)
        {
            userData.user=doc.data();
            return db.collection('Screams').where('userHandle','==',req.params.handle)
            .orderBy('createdOn','desc')
            .get();
        }
        else{
           return res.status(404).json({error:'user not found'});
        }
    })
    .then((data)=>
    {
         userData.screams=[];
         data.forEach(doc=>
            {
               userData.screams.push({
                   ...doc.data()
               }); 
            });
return res.json(userData);

    })
    .catch(err=>
        {
            console.error(err);
            res.status(500).json({error:err.code});
        })

};

exports.markNotificationsAsRead=(req,res)=>
{
    let batch=db.batch();
    req.body.forEach(notificationId =>
        {
            const notification=db.doc(`/notifications/${notificationId}`);
            batch.update(notification,{ read:true });

        });
        batch.commit()
        .then(()=>
        {
            return res.json({message:'Notification read'});
        })
        .catch(err=>{
            console.error(err);
            res.status(500).json({error:err.code});
        })
   

};