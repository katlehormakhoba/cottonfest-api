
class APIFeatures {

    constructor(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject;
    }

    filter() {
        const queryObj = { ...this.queryObject };
        const excludedFields = ['sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //2) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|le)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr))

        return this;
        // let query =  Product.find(JSON.parse(queryStr));
    }

    sort() {
        if (this.queryObject.sort) {

            const sortBy = this.queryObject.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);

        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }
    limitFields() {

        if (this.queryObject.fields) {
            const fields = this.queryObject.fields.split(',').join(' ');
            console.log(fields);
            this.query = this.query.select(fields);

        } else {
            this.query = this.query.select('-__v');
        }
        return this;

    }

    paginate() {

        const page = this.queryObject.page * 1 || 1;
        const limit = this.queryObject.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;