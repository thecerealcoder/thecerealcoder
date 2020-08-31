var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    body: String,
    createdAt: Date,
    date: String,
    image: String,
    imageId: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    slug: {
        type: String,
        unique: true
    }
});

// add a slug before the campground gets saved to the database
postSchema.pre("save", async function (next) {
    try {
        // check if a new campground is being saved, or if the campground name is being modified
        if (this.isNew || this.isModified("name")) {
            this.slug = await generateUniqueSlug(this._id, this.name);
        }
        next();
    } catch (err) {
        next(err);
    }
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;

async function generateUniqueSlug(id, postName, slug) {
    try {
        // generate the initial slug
        if (!slug) {
            slug = slugify(postName);
        }
        // check if a campground with the slug already exists
        var post = await Post.findOne({ slug: slug });
        // check if a campground was found or if the found campground is the current campground
        if (!post || post._id.equals(id)) {
            return slug;
        }
        // if not unique, generate a new slug
        var newSlug = slugify(postName);
        // check again by calling the function recursively
        return await generateUniqueSlug(id, postName, newSlug);
    } catch (err) {
        throw new Error(err);
    }
}

function slugify(text) {
    var slug = text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '')          // Trim - from end of text
        .substring(0, 75);           // Trim at 75 characters
    return slug + "-" + Math.floor(1000 + Math.random() * 9000);  // Add 4 random digits to improve uniqueness
}

