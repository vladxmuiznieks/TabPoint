import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});

const productSchema = new mongoose.Schema({ 
    name: { 
        type: String,
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    image: { 
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPTO17Sj-VnVTnWa9Ovz4s_Yuf6KMaX77WPA&usqp=CAU', // Placeholder image path
        required: true
    }
}, { 
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

export { Category, Product };
