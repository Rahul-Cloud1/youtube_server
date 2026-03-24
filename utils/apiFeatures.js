class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.search) {
      this.query = this.query.find({
        title: { $regex: this.queryStr.search, $options: "i" }
      });
    }
    return this;
  }

  filter() {
    if (this.queryStr.category) {
      this.query = this.query.find({ category: this.queryStr.category });
    }
    return this;
  }
}

export default APIFeatures;