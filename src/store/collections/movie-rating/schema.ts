import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema } from 'mongoose';

import { IMovieRating } from './model';

const movieRatingSchema = new Schema<IMovieRating>({
	movie_id: { type: Number, required: true, trim: true, index: true, background: false  },
  rating: { type: Number, required: true, trim: true, index: true, background: false  }
}, { timestamps: true });

movieRatingSchema.plugin(uniqueValidator);

export default movieRatingSchema;