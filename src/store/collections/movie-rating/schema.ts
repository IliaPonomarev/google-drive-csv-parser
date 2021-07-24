import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema } from 'mongoose';

import { IMovieRating } from './model';

const movieRatingSchema = new Schema<IMovieRating>({
	movie_id: { type: String, required: true, trim: true, index: true, unique: true },
  rating: { type: String, required: true, trim: true, index: true }
}, { timestamps: true });

movieRatingSchema.plugin(uniqueValidator);

export default movieRatingSchema;