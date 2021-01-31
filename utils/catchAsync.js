module.exports = fn => {
    return (req, res, next) => {
        //1
        fn(req, res, next).catch(next);

        //2
        // fn(req, res, next).catch(err => next(err));
    }
    
}