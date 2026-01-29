import express from 'express';
import mongoose from 'mongoose';

const clientInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    }
}, { timestamps: true });

const ClientInfo = mongoose.model('ClientInfo', clientInfoSchema);

export default ClientInfo;