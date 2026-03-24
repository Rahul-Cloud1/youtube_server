class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 🔍 SEARCH
  search() {
    if (this.queryStr.search) {
      const keyword = this.queryStr.search;

      this.query = this.query.find({
        title: { $regex: keyword, $options: "i" },
      });
    }
    return this;
  }

  // 🎛 FILTER
  filter() {
    const queryObj = { ...this.queryStr };

    // Remove special fields
    const excludedFields = ["search", "page", "limit", "sort"];
    excludedFields.forEach((el) => delete queryObj[el]);

    this.query = this.query.find(queryObj);

    return this;
  }

  // 📄 PAGINATION
  pagination(resultPerPage = 10) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

  // 🔥 SORTING
  sort() {
    if (this.queryStr.sort) {
      // example: ?sort=views or ?sort=-createdAt
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // default: latest first
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
}

export default APIFeatures;