import { Router} from "express";
import * as CollectionController from "../../controllers/collectionController";

const router = Router();

router.get("/:userId/", CollectionController.getUserCollections);
router.post("/", CollectionController.createCollection);
router.put("/:userId/:id", CollectionController.updateCollection);
router.delete("/:userId/:id", CollectionController.deleteCollection);
router.post("/addBook", CollectionController.addBookToCollection);
router.delete("/removeBook", CollectionController.removeBookFromCollection);


export default router;
