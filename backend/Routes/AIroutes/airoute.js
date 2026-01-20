import express from 'express';
const router = express.Router();
import  {main}  from '../../ai/gemenaiai.js';

router.post('/generate-website', async (req, res) => {
    const { prompt } = req.body;

    try {
        let aiResponse = await main({ prompt }); // AI returns string
   
        // Clean the HTML string
        // let cleanHtml = aiResponse
            // .replace(/\\n/g, '\n')    // convert escaped newlines to actual line breaks
            // .replace(/\\"/g, '"')     // convert escaped quotes to normal quotes
            // .replace(/\\'/g, "'")     // convert escaped single quotes
            // .replace(/\\t/g, '\t');   // optional: convert escaped tabs


        res.status(200).json(aiResponse);
        res.render('displayWebsite', { websiteContent: resparsed });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



export default router;