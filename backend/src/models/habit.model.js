import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    }, 
    description:{
        type: String,
        trim: true
    },
    streakCount:{
        type: Number,
        required: true,
        default: 0
    },
    lastCompleted:{
        type: Date,
        default: null
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    frequency:{ 
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    }

    
},{timestamps: true});

const Habit = mongoose.model('Habit', habitSchema);

export {Habit};