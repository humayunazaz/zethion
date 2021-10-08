import {ResultsBase, Tournament} from "./results.model";


export interface TournamentPerspectives extends ResultsBase {
    content: Tournament[];
}
