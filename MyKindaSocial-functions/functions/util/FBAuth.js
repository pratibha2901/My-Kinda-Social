const { admin, db }=require('../util/admin');

module.exports=(req,res,next)=>
{
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    {
        idToken=req.headers.authorization.split('Bearer ')[1];

    }
    else{
        console.error("No token found");
        res.status(403).json({error:"Unauthorized"});
    }
    //verify this id toke
    admin.auth().verifyIdToken(idToken)
    .then(decodedIdToken=>
        {
            req.user=decodedIdToken;
            console.log(decodedIdToken);
            return db.collection('users')
            .where("_userId","==",req.user.uid)
            .limit(1)
            .get();
        })
        .then(data=>
            {
                 req.user.handle=data.docs[0].data().handle;
                 req.user.imageURL=data.docs[0].data().imageURL;
                 return next();
            })
            .catch(err=>
                {
                    console.error("error while verifying token");
                    return res.status(403).json(err);
                });
};