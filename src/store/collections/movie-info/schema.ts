import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema } from 'mongoose';

import { IMovieInfo } from './model';

const movieInfoSchema = new Schema<IMovieInfo>({
	movie_id: { type: Number, required: true, trim: true, index: true, background: false },
  original_title: { type: String, required: true, trim: true, index: true, background: false  }
}, { timestamps: true });

movieInfoSchema.plugin(uniqueValidator);

export default movieInfoSchema;