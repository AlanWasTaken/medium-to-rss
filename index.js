var request = require("request");
var RSS = require("rss");

var createUserFeed = function(username, callback) {
    request.get("https://medium.com/@" + username + "?format=json", function(err, res, body) {
        if (err) {
            return callback(err, null);
        }

        var json = JSON.parse(body.substring(16));

        if (json.success === false) {
            var error = new Error(json.error || "Could not retrieve user");
            return callback(error, null);
        }

        var payload = json.payload;

        if (!payload) {
            return callback(new Error("Payload not found"), null);
        }

        var user = payload.value;

        if (!user) {
            return callback(new Error("User not found"), null);
        }

        var feed = new RSS({
            title: user.name,
            description: user.bio,
            generator: "rss-to-medium",
            site_url: "https://medium.com/@" + user.username,
            // static cdn reference
            image_url: "https://d262ilb51hltx0.cloudfront.net/fit/c/512/512/" + user.imageId,
            author: user.name
        });

        var posts = payload.latestPosts;

        if (!posts) {
            return callback(new Error("Posts not found"), null);
        }

        posts.forEach(function(post) {
            feed.item({
                title: post.title,
                description: post.subtitle,
                url: "https://medium.com/@" + user.username + "/" + post.slug + "-" + post.id,
                guid: post.id,
                date: new Date(post.createdAt)
            });
        });

        callback(null, feed.xml());
    });
};

exports.createUserFeed = createUserFeed;
