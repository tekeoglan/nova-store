const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    const whereClause = {};
    if (search) {
      whereClause.ProductName = { [Op.like]: `%${search}%` };
    }
    if (category) {
      const cat = await Category.findOne({ where: { CategoryName: { [Op.like]: `%${category}%` } } });
      if (cat) {
        whereClause.CategoryID = cat.CategoryID;
      }
    }

    if (minPrice) {
      whereClause.Price = { ...whereClause.Price, [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      whereClause.Price = { ...whereClause.Price, [Op.lte]: parseFloat(maxPrice) };
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{
        model: Category,
        attributes: ['CategoryName'],
      }],
    });
    
    const formattedProducts = products.map(p => ({
      id: p.ProductID.toString(),
      name: p.ProductName,
      category: p.Category ? p.Category.CategoryName : '',
      price: parseFloat(p.Price),
      oldPrice: p.OldPrice ? parseFloat(p.OldPrice) : undefined,
      rating: parseFloat(p.Rating) || 0,
      reviews: p.ReviewCount || 0,
      image: p.ImageURL || '',
      isSale: p.IsSale || false,
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category,
        attributes: ['CategoryName'],
      }],
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.findAll({
      where: { CategoryID: product.CategoryID },
      limit: 4,
    });

    const formattedProduct = {
      id: product.ProductID.toString(),
      name: product.ProductName,
      category: product.Category ? product.Category.CategoryName : '',
      price: parseFloat(product.Price),
      oldPrice: product.OldPrice ? parseFloat(product.OldPrice) : undefined,
      rating: parseFloat(product.Rating) || 0,
      reviews: product.ReviewCount || 0,
      image: product.ImageURL || '',
      isSale: product.IsSale || false,
      breadcrumb: ['Home', product.Category ? product.Category.CategoryName : '', product.ProductName],
      description: 'High quality product with premium features.',
      colors: [
        { name: 'Matte Black', value: '#1a1a1a' },
        { name: 'Cloud White', value: '#f5f5f5' },
        { name: 'Navy Blue', value: '#1e3a5f' },
      ],
      images: product.ImageURL ? [product.ImageURL] : [],
      features: [
        { icon: 'Quality', title: 'Premium Quality', description: 'Made with top-tier materials.' },
        { icon: 'Warranty', title: '2-Year Warranty', description: 'Full coverage for manufacturing defects.' },
        { icon: 'Support', title: '24/7 Support', description: 'Always available customer service.' },
      ],
      specs: {
        'Weight': '1.2 kg',
        'Dimensions': '30 x 20 x 10 cm',
        'Material': 'Premium Aluminum',
      },
      relatedProducts: relatedProducts
        .filter(p => p.ProductID !== product.ProductID)
        .map(p => ({
          id: p.ProductID.toString(),
          name: p.ProductName,
          category: '',
          price: parseFloat(p.Price),
          image: p.ImageURL || '',
        })),
    };

    res.json(formattedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;