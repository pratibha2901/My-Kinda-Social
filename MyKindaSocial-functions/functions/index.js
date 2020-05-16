const functions = require("firebase-functions");

const express = require("express");
const App = express();

const { db } = require("./util/admin");
const { getAllScreams } = require("./handlers/scream");
const { postOneScream } = require("./handlers/scream");
const { getScream } = require("./handlers/scream");
const { commentOnScream } = require("./handlers/scream");
const { likeScream } = require("./handlers/scream");
const { unlikeScream } = require("./handlers/scream");
const { deleteScream } = require("./handlers/scream");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getAnyUserDetail,
  markNotificationsAsRead,
} = require("./handlers/users");

//const firebase=require('firebase');
//const firebaseConfig=require('../functions/util/config');

//firebase.initializeApp(firebaseConfig);

const FBAuth = require("./util/FBAuth");

App.get("/Screams", getAllScreams);

App.post("/Scream", FBAuth, postOneScream);

App.get("/Scream/:screamId", getScream);

// TODO: delete a scream
App.delete("/Scream/:screamId", FBAuth, deleteScream);
// TODO: like a scream
App.get("/Scream/:screamId/like", FBAuth, likeScream);
// TODO: unlike a scream
App.get("/Scream/:screamId/unlike", FBAuth, unlikeScream);

//post a comment
App.post("/Scream/:screamId/comment", FBAuth, commentOnScream);
//signup route
App.post("/signup", signup);
//login route
App.post("/login", login);
//add user details
//login route
App.post("/user", FBAuth, addUserDetails);

//upload pictures

App.post("/user/image", FBAuth, uploadImage);

App.get("/user", FBAuth, getAuthenticatedUser);

App.get("/user/:handle", getAnyUserDetail);

App.post("/notifications", FBAuth, markNotificationsAsRead);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/Screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: "false",
            screamId: snapshot.data().screamId,
            type: "like",
            createdOn: new Date().toISOString(),
          });
        }
      })

      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/Screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: "false",
            screamId: snapshot.data().screamId,
            type: "comment",
            createdOn: new Date().toISOString(),
          });
        }
      })

      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document("/users/{id}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageURL !== change.after.data().imageURL) {
        console.log('image has changed');
      let batch = db.batch();
      return db
        .collection("Screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/Screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageURL });
          });
         return batch.commit();
        });
    }
  });
  exports.onScreamDeleted=functions.firestore
  .document('/Screams/{screamId}')
  .onDelete((snapshot,context)=>
  {
      const screamId=context.params.screamId;
    const batch=db.batch();
    return db.collection('comments')
    .where('screamId','==',screamId)
    .get()
    .then((data)=>{
        data.forEach((doc)=>
        {
         batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection('likes')
        .where('screamId','==',screamId).get();
    })
    .then((data)=>{
        data.forEach((doc)=>{
         batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db.collection('notifications')
        .where('screamId','==',screamId).get();
    })
    .then((data)=>{
        data.forEach((doc)=>{
         batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
    })
    .catch(err=>
        {
            console.error(err);

        })

  });

exports.api = functions.https.onRequest(App);
/*exports.getScreams=functions.https.onRequest((req,res)=>
{
admin.firestore()
.collection('Screams')
.get()
.then((data) =>
    {
        let screams=[];
        data.forEach((doc)=>
       {
            screams.push(doc.data());
       });
        return res.json(screams);
    })
    .catch(err=>console.error(err));
});
exports.createScreams=functions.https.onRequest((req,res)=>
{
    if(req.method!=='POST')
    {
        return res.json({error:'Wrong method'})
    }
const newScream=
{
    body:req.body.body,
    userHanndle:req.body.userHandle,
    createdOn:admin.firestore.Timestamp.fromDate(new Date())
};
admin.firestore()
.collection('Screams')
.add(newScream)
.then(doc=>
    {
      res.json({message: `document ${doc.id} created successfuly`})
    })
.catch((err)=>
{
    res.status(500).json({error:'Something went wrong'});
console.error(err);

});
});*/
