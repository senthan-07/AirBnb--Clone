// This Folder is for utils and expresserror
// function wrapAsync(fn){
module.exports= (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}