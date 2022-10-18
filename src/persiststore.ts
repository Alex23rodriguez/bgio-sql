import { Options, Model, ModelCtor } from "sequelize";
import { matchAttributes } from "./entities";
import { SQLStore } from "./sqlstore";

export class PersistSQLStore extends SQLStore {
  private PrevMatches: ModelCtor<Model<any, any>>;

  constructor(uri: string, options?: Options);
  constructor(options: Options);
  constructor(uriOrOptions: Options | string, extraOptions?: Options) {
    super(uriOrOptions as string, extraOptions);

    this.PrevMatches = super.sequelize.define("PrevMatches", matchAttributes, {
      tableName: "PrevMatches",
    });
  }

  async wipe(matchID: string) {
    // get the match
    const match = await super.getMatch(matchID);

    if (!match) {
      return;
    }

    const {
      id,
      gameName,
      players,
      setupData,
      gameover,
      unlisted,
      nextRoomID,
      initialState,
      state,
      log,
    } = match;

    this.PrevMatches.create({
      id,
      gameName,
      players,
      setupData,
      gameover,
      nextMatchID: nextRoomID,
      unlisted,
      initialState,
      state: state,
      log: log,
    });
    super.wipe(id);
  }
}
