const {Schema, model} = require('mongoose');

const schema = new Schema({
   name: { type: String },
   year: { type: Number },
   image: String,
   developer: { type: Schema.Types.ObjectId, ref: 'Developer', required: true },
   categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
   authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},
{
    timestamps: true
});

module.exports = model('Game', schema);

