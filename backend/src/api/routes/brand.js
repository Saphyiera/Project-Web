import express from 'express'
import BrandModel from '../../db/model/Brand.js'

const router = express.Router();

// API for adding new brands
router.post('/add', async (req, res) => {
    let check = await BrandModel.findOne({
        name: req.body.name,
        category: req.body.category
    })
    if (check) {
        return res.json({
            success: false,
            errors: "Existing brand found with the same category"
        });
    }
    
    const brand = new BrandModel({
        name: req.body.name,
        category: req.body.category,
        image: req.body.image
    });
    await brand.save();
    
    res.json({
        success: true,
        name: req.body.name
    });
})

// API for getting all brands in a category
router.get('/:category/', async (req, res) => {
    const category = req.params.category;
    let brands = await BrandModel.find({category: category});
    res.send(brands);
});

export { router };