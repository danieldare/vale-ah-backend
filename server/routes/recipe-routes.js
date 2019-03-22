import { Router } from 'express';
import User from '../middlewares/users-middleware';
import CommentController from '../controllers/comment-controller';
import RecipeReactionController from '../controllers/recipe-reaction-controller';
import controller from '../controllers/recipe-controller';

const router = Router();

router.post('/', User.validUser, controller.create);
router.get('/', controller.getRecipes);
router.get('/:slug', controller.getRecipeBySlug);
router.post('/:slug/comments', User.validUser, CommentController.create);
router.get('/:slug/comments', CommentController.getAllComments);
router.put('/:slug', User.validUser, controller.updateRecipe);
router.delete('/:slug', User.validUser, controller.deleteRecipe);

router.post(
  '/:slug/:reaction(like||dislike)',
  User.validUser,
  RecipeReactionController.likeOrDislike
);
router.get(
  '/:slug/:reaction(like||dislike)',
  User.validUser,
  RecipeReactionController.fetchAllRecipeLikeOrDislike
);

export default router;
