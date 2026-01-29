import mongoose from 'mongoose';
import ClientInfo from '../models/clientsinfomodel.js';
import Auth from '../models/authmodel.js';


export const createClientInfo = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        const newClientInfo = new ClientInfo({
            name,
            email,
            phone,
            address
        });
        const savedClientInfo = await newClientInfo.save();
        await Auth.findByIdAndUpdate(req.id, {
            $push: { clientinfo: savedClientInfo._id }
        });

        res.status(201).json(savedClientInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client info', error });
    }
};

export const getClientInfos = async (req, res) => {
    try {

        const {page} = req.query;
        console.log(page);
        const limit = 10;
        const startIndex = (Number(page) - 1) * limit;
        const authmodel = await Auth.findById(req.id).populate("clientinfo").limit(limit).skip(startIndex);
        res.status(200).json({message: "Client Infos fetched successfully", clientInfos: authmodel.clientinfo});

    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Error fetching client infos', error });
    }
}

export const deleteClientInfo = async (req, res) => {
    try {
        const { clientId } = req.query;
        console.log(clientId);
        const deletedClientInfo = await ClientInfo.findByIdAndDelete(clientId);
        if (!deletedClientInfo) {
            return res.status(404).json({ message: 'Client info not found' });
        }

        await Auth.findByIdAndUpdate(req.id, {
            $pull: { clientinfo: clientId }
        });

        res.status(200).json({ message: 'Client info deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client info', error });
    }
}