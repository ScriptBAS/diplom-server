const developerMock = require('../mock/developers.json');
const categoryMock = require('../mock/categories.json');
const Developer = require('../models/Developer');
const Category  = require('../models/Category');
module.exports = async () => {
    const categories = await Category.find();
    if (categories.length !== categoryMock.length) {
        await createInitialEntity(Category, categoryMock);
    }

    const developers = await Developer.find();
    if (developers.length !== developerMock.length) {
        await createInitialEntity(Developer, developerMock);
    }
};

async function createInitialEntity(Model, data) {
    await Model.collection.drop();
    return Promise.all(
        data.map(async item => {
            try {
                delete item._id;
                const newItem = new Model(item);
                await newItem.save();
                return newItem;
            } catch (error) {
                return error;
            }
        })
    )
}