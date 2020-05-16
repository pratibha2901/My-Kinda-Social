const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
  db.collection("Screams")
    .orderBy("createdOn", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneScream = (req, res) => {
  //if(isEmpty(req.body.body))  return res.status(400).json({message:"body cannot be empty"});
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdOn: new Date().toISOString(),
    userImage: req.user.imageURL,
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("Screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
};

exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/Screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdOn", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnScream = (req, res) => {
  if (req.body.body === "")
    return res.status(400).json({ comment: "Must not be empty" });
  const newComment = {
    body: req.body.body,
    screamId: req.params.screamId,
    createdOn: new Date().toISOString(),
    userHandle: req.user.handle,
    userImage: req.user.imageURL,
  };
  db.doc(`/Screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "scream not found" });
      }
      return doc.ref.update({commentCount: doc.data().commentCount + 1}  );
    })
    .then(()=>
    {
        return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`/Screams/${req.params.screamId}`);
  let screamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        res
          .status(400)
          .json({
            error: "You cannot unlike a scream that has not been yet liked",
          });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`/Screams/${req.params.screamId}`);
  let screamData;
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        res.status(400).json({ error: "Scream already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
exports.deleteScream=(req,res)=>
{
    const documentToDelete=db.doc(`/Screams/${req.params.screamId}`);
    documentToDelete.get()
    .then(doc=>
        {
            if(!doc.exists)
            {
                return res.status(404).json({error:'Scream you are trying to delete does not exists'})
            }
            if(doc.data().userHandle!==req.user.handle)
            {
                return res.status(403).json({error:'you are not authorized to delete someone else scream'})
            }
            else{
                documentToDelete.delete();
            }
        })
        .then(()=>
        {
            return res.json({message:`Scream with Id ${req.params.screamId} deleted successfully`});
        })
        .catch(err=>
            {
                console.error({error:err});
                res.status(500).json({error:err.code});
            })

};


