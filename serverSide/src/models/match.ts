import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  apartment: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  date: Date;
  accepted: boolean;
}

const matchSchema: Schema<IMatch> = new mongoose.Schema({
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  accepted: { type: Boolean },
});

const Match = mongoose.model<IMatch>('Match', matchSchema);

export default Match;
