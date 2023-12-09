const {ethers} = require('ethers');
const config = require('../config/config');
const cors = require("cors"); 
(async ()=>{
    const {network, privateKey, contract_Address,contract_ABI} = config;
    // const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/0fba3fdf4179467ba9832ac74d77445c');
    // provoider for Matic testnet
    const provider = new ethers.JsonRpcProvider('https://autumn-falling-firefly.matic-testnet.quiknode.pro/c8e3ff914ff86361fd66c6de0e7aed3c878963fb/')
    // provoider for Scroll sepolia testnet
    // const provider = new ethers.JsonRpcProvider('https://silent-thrilling-frost.scroll-testnet.quiknode.pro/028364d65d7818e04d58c37105ccc9e342e48c54/')
    const wallet = new ethers.Wallet(privateKey, provider);
    const express = require("express");
    const app = express();
    const port = 3001;
    
    const cfn = new ethers.Contract(contract_Address,contract_ABI,wallet)
    app.use(express.json());
    app.use(cors());


    app.get("/", (req, res) => {
        res.send("Welcome to your Express.js application");
    });

    app.post("/api/initialize",async (req,res)=>
    {
        try{
            const {name} = req.body;
            const tx = await cfn.initialize(name,"0xf73687C4d37d363e8f97Fad2bd03bc7b68876A72");
            await tx.wait();
            res.status(200).json({
                message: `Initialize function is triggered and anchor of trust is stored in blockchain`,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
        
    })

    app.get('/api/viewAnchorOfTrust',async (req,res)=>
    {
        try {
            const anchorOfTrust = await cfn.viewAnchorOfTrust();
            res.status(200).json({
              message: `The Anchor of Trust stored in blockchain is :${anchorOfTrust}.`,
            });
          } catch (error) {
            logger.error(error.message);
            res.status(400).json({ error: error.message });
          }
    })
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();