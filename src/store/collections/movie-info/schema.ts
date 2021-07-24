import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema } from 'mongoose';

import { IMovieInfo } from './model';

const movieInfoSchema = new Schema<IMovieInfo>({
	movie_id: { type: String, required: true, trim: true, index: true, unique: true },
  original_title: { type: String, required: true, trim: true, index: true }
}, { timestamps: true });

movieInfoSchema.plugin(uniqueValidator);

export default movieInfoSchema;