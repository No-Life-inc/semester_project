import {Request,Response} from "express";
import Collection from "../models/sequelize/Collection";
import UserCollection from "../models/sequelize/UserCollection";
import UserBook from "../models/sequelize/UserBook";

export const createCollection = async (req: Request, res: Response) => {
    const {name, userId} = req.body;
    try{
        const newCollection = await Collection.create({name});
        await UserCollection.create({user_id: userId, collection_id: newCollection.id});
        res.status(201).json(newCollection);
    }catch (error){
        res.status(500).json({message: "An error occurred while creating the collection", error});
    }
};