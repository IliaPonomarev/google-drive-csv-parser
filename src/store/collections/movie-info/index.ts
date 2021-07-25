import { model } from 'mongoose';

import movieInfoSchema from './schema';
import { IMovieInfo, IDBMovieInfo } from './model';


export class DBMovieInfo implements IDBMovieInfo {
  public model: any;

	constructor() {
    this.model = model<IMovieInfo>('Movie', movieInfoSchema);
	}

  public add(instance: IMovieInfo) {
    return this.model.create(instance);
  }

  public async findWithHighestRating(limit = 10) {
    return this.model.aggregate(
      [
        { $project : {  original_title: 1, movie_id: 1, 'movieInfo.rating': 1 } },
        {
          $lookup: {
            from: 'movie_ratings',
            localField: 'movie_id',
            foreignField: 'movie_id',
            as: 'movieInfo'
          }
        },
        { $unwind: '$movieInfo' },
        {
          $group:
            {
              _id: '$movie_id',
              avgRating: { $avg: '$movieInfo.rating' },
              original_title: { $first: '$original_title' }
            }
        },
        {
          $sort: { 'avgRating': -1 }
        },
        {
          $limit: limit
        }
      ]
    );
  }
}
